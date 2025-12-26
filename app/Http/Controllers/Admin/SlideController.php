<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Models\Slide;
use App\Traits\HasListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SlideController extends Controller
{
    use HasListing;

    public function listing(Request $request): JsonResponse
    {
        try {
            $query = Slide::query();

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where('type', 'like', "%{$search}%")
                      ->orWhere('url', 'like', "%{$search}%");
            }

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

            $slides = $query->paginate($pageSize, ['*'], 'page', $currentPage);

            $data = $slides->getCollection()->map(fn($slide) => [
                'id' => $slide->id,
                'type' => $slide->type,
                'url' => $slide->url,
                'image' => $slide->getFirstMediaUrl('slides'),
                'status' => $slide->status,
                'created_at' => $slide->created_at?->format('Y-m-d'),
            ]);

            return response()->json([
                'data' => $data,
                'current' => $slides->currentPage(),
                'pageSize' => $slides->perPage(),
                'total' => $slides->total(),
                'totalPages' => $slides->lastPage(),
            ]);
        } catch (\Throwable $e) {
            return Response::error($e->getMessage(), 500);
        }
    }

    public function index(): InertiaResponse
    {
        return Inertia::render('Admin/CMS/Slides/Listing');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'nullable|string|max:50',
            'url' => 'nullable|url',
            'status' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        $slide = Slide::create([
            'type' => $validated['type'] ?? 'hero',
            'url' => $validated['url'] ?? null,
            'status' => $validated['status'] ?? true,
        ]);

        if ($request->hasFile('image')) {
            $slide->addMediaFromRequest('image')->toMediaCollection('slides');
        }

        Notify::success('Slide created successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'slide' => [
                    'id' => $slide->id,
                    'type' => $slide->type,
                    'url' => $slide->url,
                    'image' => $slide->getFirstMediaUrl('slides'),
                    'status' => $slide->status,
                ],
            ]);
        }

        return redirect()->route('admin.slides.index')
            ->with('success', 'Slide created successfully.');
    }

    public function update(Request $request, Slide $slide)
    {
        $validated = $request->validate([
            'type' => 'nullable|string|max:50',
            'url' => 'nullable|url',
            'status' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        $slide->update([
            'type' => $validated['type'] ?? $slide->type,
            'url' => $validated['url'] ?? $slide->url,
            'status' => $validated['status'] ?? $slide->status,
        ]);

        if ($request->hasFile('image')) {
            $slide->clearMediaCollection('slides');
            $slide->addMediaFromRequest('image')->toMediaCollection('slides');
        }

        Notify::success('Slide updated successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'slide' => [
                    'id' => $slide->id,
                    'type' => $slide->type,
                    'url' => $slide->url,
                    'image' => $slide->getFirstMediaUrl('slides'),
                    'status' => $slide->status,
                ],
            ]);
        }

        return redirect()->route('admin.slides.index')
            ->with('success', 'Slide updated successfully.');
    }

    public function destroy(Request $request, Slide $slide)
    {
        $slide->clearMediaCollection('slides');
        $slide->delete();

        Notify::success('Slide deleted successfully.');

        if ($request->wantsJson()) {
            return Response::success();
        }

        return redirect()->route('admin.slides.index')
            ->with('success', 'Slide deleted successfully.');
    }
}
