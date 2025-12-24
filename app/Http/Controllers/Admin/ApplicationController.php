<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Application::with(['user', 'project.diploma']);

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('cnic', 'like', "%{$search}%");
            });
        }

        // Filter by project
        if ($request->has('project_id') && $request->project_id) {
            $query->where('project_id', $request->project_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $applications = $query->latest()
            ->paginate($request->per_page ?? 15)
            ->through(function ($application) {
                return [
                    'id' => $application->id,
                    'user_id' => $application->user_id,
                    'name' => $application->user?->full_name ?? 'N/A',
                    'email' => $application->user?->email ?? 'N/A',
                    'phone' => $application->user?->phone ?? 'N/A',
                    'cnic' => $application->user?->cnic ?? 'N/A',
                    'project' => $application->project?->name ?? 'N/A',
                    'diploma' => $application->project?->diploma?->name ?? 'N/A',
                    'status' => $application->status,
                    'quota' => $application->quotaName ?? [],
                    'challan_no' => $application->challan_no,
                    'avatar' => $application->user?->avatar,
                    'created_at' => $application->created_at?->format('Y-m-d'),
                ];
            });

        // Get filter options
        $projects = Project::where('status', 1)->get(['id', 'name']);
        $statuses = ['Pending', 'Paid', 'Rejected', 'Approved'];

        return Inertia::render('Admin/Applications/Index', [
            'applications' => $applications,
            'projects' => $projects,
            'statuses' => $statuses,
            'filters' => $request->only(['search', 'project_id', 'status', 'per_page']),
        ]);
    }

    public function show(Application $application): Response
    {
        $application->load([
            'user.student.diploma',
            'user.student.district',
            'user.education',
            'project.diploma',
        ]);

        return Inertia::render('Admin/Applications/Show', [
            'application' => [
                'id' => $application->id,
                'status' => $application->status,
                'challan_no' => $application->challan_no,
                'quota' => $application->quotaName ?? [],
                'remarks' => $application->remarks,
                'created_at' => $application->created_at?->format('Y-m-d H:i'),
                'updated_at' => $application->updated_at?->format('Y-m-d H:i'),
                'user' => [
                    'id' => $application->user?->id,
                    'full_name' => $application->user?->full_name,
                    'email' => $application->user?->email,
                    'phone' => $application->user?->phone,
                    'cnic' => $application->user?->cnic,
                    'avatar' => $application->user?->avatar,
                ],
                'student' => $application->user?->student ? [
                    'father_name' => $application->user->student->father_name,
                    'date_of_birth' => $application->user->student->date_of_birth,
                    'address' => $application->user->student->address,
                    'diploma' => $application->user->student->diploma?->name,
                    'district' => $application->user->student->district?->name,
                ] : null,
                'education' => $application->user?->education?->map(function ($edu) {
                    return [
                        'id' => $edu->id,
                        'degree' => $edu->degree,
                        'board' => $edu->board,
                        'year' => $edu->year,
                        'total_marks' => $edu->total_marks,
                        'obtained_marks' => $edu->obtained_marks,
                        'percentage' => $edu->total_marks > 0
                            ? round(($edu->obtained_marks / $edu->total_marks) * 100, 2)
                            : 0,
                    ];
                }) ?? [],
                'project' => [
                    'id' => $application->project?->id,
                    'name' => $application->project?->name,
                    'diploma' => $application->project?->diploma?->name,
                    'seats' => $application->project?->seats,
                    'fee' => $application->project?->fee,
                ],
                'documents' => $application->getMedia('documents')->map(function ($media) {
                    return [
                        'id' => $media->id,
                        'name' => $media->name,
                        'url' => $media->getUrl(),
                        'type' => $media->mime_type,
                    ];
                }),
            ],
        ]);
    }

    public function updateStatus(Request $request, Application $application)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Paid,Rejected,Approved',
            'remarks' => 'nullable|string|max:500',
        ]);

        $application->update($validated);

        return redirect()->back()
            ->with('success', 'Application status updated successfully.');
    }

    public function destroy(Application $application)
    {
        $application->delete();

        return redirect()->route('admin.applications.index')
            ->with('success', 'Application deleted successfully.');
    }

    public function export(Request $request)
    {
        // This will use the existing ApplicationsExport class
        // For now, redirect back with message
        return redirect()->back()
            ->with('info', 'Export functionality will be implemented.');
    }
}
