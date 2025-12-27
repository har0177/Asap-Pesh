<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TaxonomyTypeEnum;
use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Models\Taxonomy;
use App\Traits\HasListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class TaxonomyController extends Controller
{
    use HasListing;

    /**
     * Get all taxonomy types
     */
    protected function getTaxonomyTypes(): array
    {
        return [
            ['value' => TaxonomyTypeEnum::DIPLOMA, 'label' => 'Diploma'],
            ['value' => TaxonomyTypeEnum::SECTION, 'label' => 'Section'],
            ['value' => TaxonomyTypeEnum::SESSION, 'label' => 'Session'],
            ['value' => TaxonomyTypeEnum::DEGREE, 'label' => 'Degree'],
            ['value' => TaxonomyTypeEnum::BLOODGROUP, 'label' => 'Blood Group'],
            ['value' => TaxonomyTypeEnum::GENDER, 'label' => 'Gender'],
            ['value' => TaxonomyTypeEnum::DISTRICT, 'label' => 'District'],
            ['value' => TaxonomyTypeEnum::QUOTA, 'label' => 'Quota'],
            ['value' => TaxonomyTypeEnum::PROVINCE, 'label' => 'Province'],
        ];
    }

    /**
     * Display taxonomy listing page
     */
    public function index(Request $request): InertiaResponse
    {
        $type = $request->input('type', TaxonomyTypeEnum::DIPLOMA);

        // Get parent options for sections (diplomas)
        $parentOptions = [];
        if ($type === TaxonomyTypeEnum::SECTION) {
            $parentOptions = Taxonomy::whereType(TaxonomyTypeEnum::DIPLOMA)
                ->orderBy('name')
                ->get()
                ->map(fn($t) => ['id' => $t->id, 'label' => $t->name]);
        } elseif ($type === TaxonomyTypeEnum::DISTRICT) {
            $parentOptions = Taxonomy::whereType(TaxonomyTypeEnum::PROVINCE)
                ->orderBy('name')
                ->get()
                ->map(fn($t) => ['id' => $t->id, 'label' => $t->name]);
        }

        return Inertia::render('Admin/Taxonomies/Listing', [
            'types' => $this->getTaxonomyTypes(),
            'selectedType' => $type,
            'parentOptions' => $parentOptions,
        ]);
    }

    /**
     * JSON listing for DataGridTable (AG Grid)
     */
    public function listing(Request $request): JsonResponse
    {
        try {
            $type = $request->input('type', TaxonomyTypeEnum::DIPLOMA);

            $query = Taxonomy::where('type', $type)
                ->with('parent');

            // Search
            if ($search = $request->input('search')) {
                $query->where('name', 'like', "%{$search}%");
            }

            // Sorting
            $sortField = $request->input('sortField', 'id');
            $sortOrder = $request->input('sortOrder', 'desc');
            $query->orderBy($sortField, $sortOrder);

            // Pagination
            $perPage = $request->input('perPage', 20);
            $page = $request->input('page', 1);

            $total = $query->count();
            $data = $query->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get()
                ->map(fn($t) => [
                    'id' => $t->id,
                    'name' => $t->name,
                    'type' => $t->type,
                    'parent_id' => $t->parent_id,
                    'parent_name' => $t->parent?->name,
                    'created_at' => $t->created_at?->format('Y-m-d H:i:s'),
                ]);

            return response()->json([
                'data' => $data,
                'total' => $total,
                'page' => $page,
                'perPage' => $perPage,
                'lastPage' => ceil($total / $perPage),
            ]);
        } catch (\Throwable $e) {
            return Response::error($e->getMessage(), 500);
        }
    }

    /**
     * Store a new taxonomy
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:taxonomies,name',
            'type' => 'required|string',
            'parent_id' => 'nullable|exists:taxonomies,id',
        ]);

        $taxonomy = Taxonomy::create($validated);

        Notify::success('Taxonomy created successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'taxonomy' => $taxonomy,
            ]);
        }

        return redirect()->back()->with('success', 'Taxonomy created successfully.');
    }

    /**
     * Get a single taxonomy
     */
    public function show(Request $request, Taxonomy $taxonomy)
    {
        if ($request->wantsJson()) {
            return Response::success([
                'taxonomy' => [
                    'id' => $taxonomy->id,
                    'name' => $taxonomy->name,
                    'type' => $taxonomy->type,
                    'parent_id' => $taxonomy->parent_id,
                    'parent_name' => $taxonomy->parent?->name,
                ],
            ]);
        }

        return Inertia::render('Admin/Taxonomies/Show', [
            'taxonomy' => $taxonomy,
        ]);
    }

    /**
     * Update a taxonomy
     */
    public function update(Request $request, Taxonomy $taxonomy)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('taxonomies', 'name')->ignore($taxonomy->id),
            ],
            'parent_id' => 'nullable|exists:taxonomies,id',
        ]);

        $taxonomy->update($validated);

        Notify::success('Taxonomy updated successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'taxonomy' => $taxonomy,
            ]);
        }

        return redirect()->back()->with('success', 'Taxonomy updated successfully.');
    }

    /**
     * Delete a taxonomy
     */
    public function destroy(Request $request, Taxonomy $taxonomy)
    {
        // Check if taxonomy has children
        if ($taxonomy->children()->count() > 0) {
            Notify::error('Cannot delete taxonomy with child items.');

            if ($request->wantsJson()) {
                return Response::error('Cannot delete taxonomy with child items.', 400);
            }

            return redirect()->back()->withErrors(['error' => 'Cannot delete taxonomy with child items.']);
        }

        $taxonomy->delete();

        Notify::success('Taxonomy deleted successfully.');

        if ($request->wantsJson()) {
            return Response::success();
        }

        return redirect()->back()->with('success', 'Taxonomy deleted successfully.');
    }
}
