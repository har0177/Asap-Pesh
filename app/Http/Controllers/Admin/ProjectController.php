<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TaxonomyTypeEnum;
use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\Taxonomy;
use App\Traits\HasListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ProjectController extends Controller
{
    use HasListing;

    /**
     * JSON listing for DataGridTable (AG Grid)
     */
    public function listing(Request $request): JsonResponse
    {
        try {
            $result = $this->getListing(
                $request,
                Project::class,
                ['diploma'],
                ProjectResource::class,
                [
                    'withCount' => ['applications'],
                ]
            );

            if ($request->boolean('export')) {
                return $result;
            }

            return response()->json($result);
        } catch (\Throwable $e) {
            return Response::error($e->getMessage(), 500);
        }
    }

    public function index(Request $request): InertiaResponse
    {
        return Inertia::render('Admin/Projects/Listing');
    }

    public function create(): InertiaResponse
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

        Notify::success('Project created successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'project' => new ProjectResource($project->load('diploma')),
            ]);
        }

        return redirect()->route('admin.projects.index')
            ->with('success', 'Project created successfully.');
    }

    public function show(Request $request, Project $project)
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

        if ($request->wantsJson()) {
            return Response::success([
                'project' => new ProjectResource($project),
                'stats' => $stats,
            ]);
        }

        return Inertia::render('Admin/Projects/Show', [
            'project' => new ProjectResource($project),
            'stats' => $stats,
            'recentApplications' => $project->applications()
                ->with('user')
                ->latest()
                ->take(10)
                ->get()
                ->map(fn($app) => [
                    'id' => $app->id,
                    'name' => $app->user?->full_name,
                    'email' => $app->user?->email,
                    'status' => $app->status,
                    'created_at' => $app->created_at?->format('Y-m-d'),
                ]),
        ]);
    }

    public function edit(Project $project): InertiaResponse
    {
        $diplomas = Taxonomy::where('type', TaxonomyTypeEnum::DIPLOMA)->get(['id', 'name']);
        $quotas = Taxonomy::where('type', TaxonomyTypeEnum::QUOTA)->get(['id', 'name']);

        return Inertia::render('Admin/Projects/Edit', [
            'project' => new ProjectResource($project->load('diploma')),
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

        Notify::success('Project updated successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'project' => new ProjectResource($project->load('diploma')),
            ]);
        }

        return redirect()->route('admin.projects.index')
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Request $request, Project $project)
    {
        if ($project->applications()->count() > 0) {
            Notify::error('Cannot delete project with existing applications.');

            if ($request->wantsJson()) {
                return Response::error('Cannot delete project with existing applications.', 422);
            }

            return redirect()->back()
                ->with('error', 'Cannot delete project with existing applications.');
        }

        $project->delete();

        Notify::success('Project deleted successfully.');

        if ($request->wantsJson()) {
            return Response::success();
        }

        return redirect()->route('admin.projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    public function restore(Request $request, int $id)
    {
        $project = Project::withTrashed()->findOrFail($id);
        $project->restore();

        Notify::success('Project restored successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'project' => new ProjectResource($project->load('diploma')),
            ]);
        }

        return redirect()->route('admin.projects.index')
            ->with('success', 'Project restored successfully.');
    }
}
