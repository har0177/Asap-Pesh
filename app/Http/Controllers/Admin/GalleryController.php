<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Traits\HasListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class GalleryController extends Controller
{
    use HasListing;

    public function listing(Request $request): JsonResponse
    {
        try {
            $query = Gallery::query();

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where('title', 'like', "%{$search}%");
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

            $galleries = $query->paginate($pageSize, ['*'], 'page', $currentPage);

            $data = $galleries->getCollection()->map(fn($gallery) => [
                'id' => $gallery->id,
                'title' => $gallery->title,
                'images' => $gallery->getMedia('gallery')->map(fn($media) => $media->getUrl())->take(4),
                'images_count' => $gallery->getMedia('gallery')->count(),
                'status' => $gallery->status,
                'created_at' => $gallery->created_at?->format('Y-m-d'),
            ]);

            return response()->json([
                'data' => $data,
                'current' => $galleries->currentPage(),
                'pageSize' => $galleries->perPage(),
                'total' => $galleries->total(),
                'totalPages' => $galleries->lastPage(),
            ]);
        } catch (\Throwable $e) {
            return Response::error($e->getMessage(), 500);
        }
    }

    public function index(): InertiaResponse
    {
        return Inertia::render('Admin/CMS/Gallery/Listing');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|max:2048',
        ]);

        $gallery = Gallery::create([
            'title' => $validated['title'],
            'status' => $validated['status'] ?? true,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $gallery->addMedia($image)->toMediaCollection('gallery');
            }
        }

        Notify::success('Gallery created successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'gallery' => [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'images' => $gallery->getMedia('gallery')->map(fn($m) => $m->getUrl()),
                    'status' => $gallery->status,
                ],
            ]);
        }

        return redirect()->route('admin.gallery.index')
            ->with('success', 'Gallery created successfully.');
    }

    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|max:2048',
        ]);

        $gallery->update([
            'title' => $validated['title'],
            'status' => $validated['status'] ?? $gallery->status,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $gallery->addMedia($image)->toMediaCollection('gallery');
            }
        }

        Notify::success('Gallery updated successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'gallery' => [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'images' => $gallery->getMedia('gallery')->map(fn($m) => $m->getUrl()),
                    'status' => $gallery->status,
                ],
            ]);
        }

        return redirect()->route('admin.gallery.index')
            ->with('success', 'Gallery updated successfully.');
    }

    public function destroy(Request $request, Gallery $gallery)
    {
        $gallery->clearMediaCollection('gallery');
        $gallery->delete();

        Notify::success('Gallery deleted successfully.');

        if ($request->wantsJson()) {
            return Response::success();
        }

        return redirect()->route('admin.gallery.index')
            ->with('success', 'Gallery deleted successfully.');
    }
}
