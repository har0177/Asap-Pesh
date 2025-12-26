<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TaxonomyTypeEnum;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Taxonomy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * JSON listing for DataGridTable (AG Grid)
     */
    public function listing(Request $request): JsonResponse
    {
        $query = Project::with('diploma')->withCount('applications');

        // Handle soft deleted
        if ($request->boolean('soft_deleted')) {
            $query->onlyTrashed();
        }

        // Handle search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('diploma', function ($dq) use ($search) {
                        $dq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Handle filterTree from GlobalFilter
        if ($request->filled('filterTree')) {
            $filterTree = $request->filterTree;
            if (!empty($filterTree['conditions'])) {
                $this->applyFilterTree($query, $filterTree);
            }
        }

        // Handle sorting
        $sortModel = $request->input('sort', []);
        if (!empty($sortModel)) {
            foreach ($sortModel as $sort) {
                $colId = $sort['colId'] ?? null;
                $sortDirection = $sort['sort'] ?? 'asc';
                if ($colId) {
                    $query->orderBy($colId, $sortDirection);
                }
            }
        } else {
            $query->latest();
        }

        $pageSize = $request->input('pageSize', 20);
        $currentPage = $request->input('current', 1);

        $projects = $query->paginate($pageSize, ['*'], 'page', $currentPage);

        $data = $projects->getCollection()->map(function ($project) {
            return [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'diploma' => [
                    'id' => $project->diploma?->id,
                    'name' => $project->diploma?->name,
                ],
                'seats' => $project->seats,
                'fee' => $project->fee,
                'deadline' => $project->deadline,
                'status' => $project->status,
                'applications_count' => $project->applications_count ?? 0,
                'quota' => $project->quotaName ?? [],
                'created_at' => $project->created_at?->format('Y-m-d'),
                'updated_at' => $project->updated_at?->format('Y-m-d'),
                'deleted_at' => $project->deleted_at?->format('Y-m-d'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
            'total' => $projects->total(),
            'pagination' => [
                'current_page' => $projects->currentPage(),
                'last_page' => $projects->lastPage(),
                'per_page' => $projects->perPage(),
                'total' => $projects->total(),
            ],
        ]);
    }

    /**
     * Apply filter tree from GlobalFilter component
     */
    protected function applyFilterTree($query, array $filterTree): void
    {
        $type = $filterTree['type'] ?? 'AND';
        $conditions = $filterTree['conditions'] ?? [];

        $query->where(function ($q) use ($conditions, $type) {
            foreach ($conditions as $condition) {
                if (isset($condition['conditions'])) {
                    $this->applyFilterTree($q, $condition);
                } else {
                    $field = $condition['field'] ?? null;
                    $operator = $condition['operator'] ?? 'is';
                    $value = $condition['value'] ?? null;

                    if ($field && $value !== null) {
                        $method = strtolower($type) === 'or' ? 'orWhere' : 'where';

                        if ($field === 'diploma_id' || $field === 'status') {
                            $q->$method($field, is_array($value) ? $value[0] : $value);
                        } else {
                            $q->$method($field, 'like', "%{$value}%");
                        }
                    }
                }
            }
        });
    }

    public function index(Request $request): Response
    {
        // Render the new AG Grid listing page
        return Inertia::render('Admin/Projects/Listing');
    }

    public function create(): Response
    {
        $diplomas = Taxonomy::where('type', TaxonomyTypeEnum::DIPLOMA)->get(['id', 'name']);
        $quotas = Taxonomy::where('type', TaxonomyTypeEnum::QUOTA)->get(['id', 'name']);

        return Inertia::render('Admin/Projects/Create', [
            'diplomas' => $diplomas,
            'quotas' => $quotas,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'diploma_id' => 'required|exists:taxonomies,id',
            'seats' => 'required|integer|min:1',
            'fee' => 'required|numeric|min:0',
            'deadline' => 'nullable|date',
            'quota' => 'nullable|array',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $project = Project::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Project created successfully.',
            ]);
        }

        return redirect()->route('v2.admin.projects.index')
            ->with('success', 'Project created successfully.');
    }

    public function show(Project $project): Response
    {
        $project->load(['diploma', 'applications.user']);

        // Get application statistics
        $stats = [
            'total' => $project->applications()->count(),
            'pending' => $project->applications()->where('status', 'Pending')->count(),
            'paid' => $project->applications()->where('status', 'Paid')->count(),
            'approved' => $project->applications()->where('status', 'Approved')->count(),
            'rejected' => $project->applications()->where('status', 'Rejected')->count(),
        ];

        return Inertia::render('Admin/Projects/Show', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'diploma' => $project->diploma?->name,
                'seats' => $project->seats,
                'fee' => $project->fee,
                'deadline' => $project->deadline,
                'status' => $project->status,
                'description' => $project->description,
                'quota' => $project->quotaName ?? [],
                'created_at' => $project->created_at?->format('Y-m-d H:i'),
            ],
            'stats' => $stats,
            'recentApplications' => $project->applications()
                ->with('user')
                ->latest()
                ->take(10)
                ->get()
                ->map(function ($app) {
                    return [
                        'id' => $app->id,
                        'name' => $app->user?->full_name,
                        'email' => $app->user?->email,
                        'status' => $app->status,
                        'created_at' => $app->created_at?->format('Y-m-d'),
                    ];
                }),
        ]);
    }

    public function edit(Project $project): Response
    {
        $diplomas = Taxonomy::where('type', TaxonomyTypeEnum::DIPLOMA)->get(['id', 'name']);
        $quotas = Taxonomy::where('type', TaxonomyTypeEnum::QUOTA)->get(['id', 'name']);

        return Inertia::render('Admin/Projects/Edit', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'diploma_id' => $project->diploma_id,
                'seats' => $project->seats,
                'fee' => $project->fee,
                'deadline' => $project->deadline,
                'quota' => $project->quota ?? [],
                'description' => $project->description,
                'status' => $project->status,
            ],
            'diplomas' => $diplomas,
            'quotas' => $quotas,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'diploma_id' => 'required|exists:taxonomies,id',
            'seats' => 'required|integer|min:1',
            'fee' => 'required|numeric|min:0',
            'deadline' => 'nullable|date',
            'quota' => 'nullable|array',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $project->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Project updated successfully.',
            ]);
        }

        return redirect()->route('v2.admin.projects.index')
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Request $request, Project $project)
    {
        if ($project->applications()->count() > 0) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete project with existing applications.',
                ], 422);
            }

            return redirect()->back()
                ->with('error', 'Cannot delete project with existing applications.');
        }

        $project->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Project deleted successfully.',
            ]);
        }

        return redirect()->route('v2.admin.projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    public function restore(Request $request, int $id)
    {
        $project = Project::withTrashed()->findOrFail($id);
        $project->restore();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Project restored successfully.',
            ]);
        }

        return redirect()->route('v2.admin.projects.index')
            ->with('success', 'Project restored successfully.');
    }
}
