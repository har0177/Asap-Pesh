<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TaxonomyTypeEnum;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Taxonomy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Project::with('diploma');

        // Search
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // Filter by diploma
        if ($request->has('diploma_id') && $request->diploma_id) {
            $query->where('diploma_id', $request->diploma_id);
        }

        $projects = $query->latest()
            ->paginate($request->per_page ?? 15)
            ->through(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'diploma' => $project->diploma?->name ?? 'N/A',
                    'seats' => $project->seats,
                    'fee' => $project->fee,
                    'deadline' => $project->deadline,
                    'status' => $project->status,
                    'applications_count' => $project->applications()->count(),
                    'quota' => $project->quotaName ?? [],
                    'created_at' => $project->created_at?->format('Y-m-d'),
                ];
            });

        // Get filter options
        $diplomas = Taxonomy::where('type', TaxonomyTypeEnum::DIPLOMA)->get(['id', 'name']);

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'diplomas' => $diplomas,
            'filters' => $request->only(['search', 'status', 'diploma_id', 'per_page']),
        ]);
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

        Project::create($validated);

        return redirect()->route('admin.projects.index')
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

        return redirect()->route('admin.projects.index')
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        if ($project->applications()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete project with existing applications.');
        }

        $project->delete();

        return redirect()->route('admin.projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
