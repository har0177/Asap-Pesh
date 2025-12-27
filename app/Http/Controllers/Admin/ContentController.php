<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Traits\HasListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ContentController extends Controller
{
    use HasListing;

    public function listing(Request $request): JsonResponse
    {
        try {
            $query = Content::query();

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('type', 'like', "%{$search}%");
                });
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

            $contents = $query->paginate($pageSize, ['*'], 'page', $currentPage);

            $data = $contents->getCollection()->map(fn($content) => [
                'id' => $content->id,
                'title' => $content->title,
                'slug' => $content->slug,
                'type' => $content->type,
                'excerpt' => \Str::limit(strip_tags($content->body), 100),
                'status' => $content->status ?? true,
                'created_at' => $content->created_at?->format('Y-m-d'),
                'updated_at' => $content->updated_at?->format('Y-m-d'),
            ]);

            return response()->json([
                'data' => $data,
                'current' => $contents->currentPage(),
                'pageSize' => $contents->perPage(),
                'total' => $contents->total(),
                'totalPages' => $contents->lastPage(),
            ]);
        } catch (\Throwable $e) {
            return Response::error($e->getMessage(), 500);
        }
    }

    public function index(): InertiaResponse
    {
        return Inertia::render('Admin/CMS/Content/Listing');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'nullable|string|max:50',
            'body' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $content = Content::create($validated);

        Notify::success('Content created successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'content' => [
                    'id' => $content->id,
                    'title' => $content->title,
                    'slug' => $content->slug,
                    'type' => $content->type,
                    'status' => $content->status,
                ],
            ]);
        }

        return redirect()->route('admin.content.index')
            ->with('success', 'Content created successfully.');
    }

    public function show(Request $request, Content $content)
    {
        if ($request->wantsJson()) {
            return Response::success([
                'content' => [
                    'id' => $content->id,
                    'title' => $content->title,
                    'slug' => $content->slug,
                    'type' => $content->type,
                    'body' => $content->body,
                    'status' => $content->status,
                    'created_at' => $content->created_at?->format('Y-m-d H:i'),
                ],
            ]);
        }

        return Inertia::render('Admin/CMS/Content/Show', [
            'content' => [
                'id' => $content->id,
                'title' => $content->title,
                'slug' => $content->slug,
                'type' => $content->type,
                'body' => $content->body,
                'status' => $content->status,
                'created_at' => $content->created_at?->format('Y-m-d H:i'),
            ],
        ]);
    }

    public function update(Request $request, Content $content)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'nullable|string|max:50',
            'body' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $content->update($validated);

        Notify::success('Content updated successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'content' => [
                    'id' => $content->id,
                    'title' => $content->title,
                    'slug' => $content->slug,
                    'type' => $content->type,
                    'status' => $content->status,
                ],
            ]);
        }

        return redirect()->route('admin.content.index')
            ->with('success', 'Content updated successfully.');
    }

    public function destroy(Request $request, Content $content)
    {
        $content->clearMediaCollection('images');
        $content->delete();

        Notify::success('Content deleted successfully.');

        if ($request->wantsJson()) {
            return Response::success();
        }

        return redirect()->route('admin.content.index')
            ->with('success', 'Content deleted successfully.');
    }

    /**
     * Upload images to content (supports multiple files)
     */
    public function uploadImages(Request $request, Content $content): JsonResponse
    {
        try {
            $request->validate([
                'images' => 'required|array',
                'images.*' => 'image|max:10240', // 10MB max per image
            ]);

            $uploadedImages = [];
            foreach ($request->file('images') as $image) {
                $media = $content->addMedia($image)
                    ->toMediaCollection('images');

                $uploadedImages[] = [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'name' => $media->name,
                ];
            }

            Notify::success(count($uploadedImages) . ' image(s) uploaded successfully.');

            return Response::success([
                'message' => count($uploadedImages) . ' image(s) uploaded successfully',
                'images' => $uploadedImages,
            ]);
        } catch (\Throwable $e) {
            return Response::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete a specific image
     */
    public function deleteImage(Content $content, int $mediaId): JsonResponse
    {
        try {
            $media = $content->getMedia('images')->where('id', $mediaId)->first();

            if (!$media) {
                return Response::error('Image not found', 404);
            }

            $media->delete();

            Notify::success('Image deleted successfully.');

            return Response::success(['message' => 'Image deleted successfully']);
        } catch (\Throwable $e) {
            return Response::error($e->getMessage(), 500);
        }
    }

    /**
     * Get content with all images (for public pages)
     */
    public function getWithImages(string $slug): JsonResponse
    {
        try {
            $content = Content::where('slug', $slug)->first();

            if (!$content) {
                return Response::error('Content not found', 404);
            }

            return Response::success([
                'content' => [
                    'id' => $content->id,
                    'title' => $content->title,
                    'slug' => $content->slug,
                    'type' => $content->type,
                    'body' => $content->body,
                    'images' => $content->getMedia('images')->map(function ($media) {
                        return [
                            'id' => $media->id,
                            'url' => $media->getUrl(),
                            'name' => $media->name,
                        ];
                    }),
                ],
            ]);
        } catch (\Throwable $e) {
            return Response::error($e->getMessage(), 500);
        }
    }
}
