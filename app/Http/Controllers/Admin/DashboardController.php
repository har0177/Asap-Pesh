<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Employee;
use App\Models\Project;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Get statistics
        $stats = [
            'totalStudents' => Student::count(),
            'totalApplications' => Application::count(),
            'pendingApplications' => Application::where('status', 'Pending')->count(),
            'paidApplications' => Application::where('status', 'Paid')->count(),
            'totalEmployees' => Employee::count(),
            'totalUsers' => User::count(),
            'activeProjects' => Project::where('status', 1)->count(),
        ];

        // Get recent applications with user and project data
        $recentApplications = Application::with(['user', 'project'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($application) {
                return [
                    'id' => $application->id,
                    'key' => (string) $application->id,
                    'name' => $application->user?->full_name ?? 'N/A',
                    'email' => $application->user?->email ?? 'N/A',
                    'program' => $application->project?->name ?? 'N/A',
                    'status' => strtolower($application->status ?? 'pending'),
                    'date' => $application->created_at?->format('Y-m-d') ?? 'N/A',
                ];
            });

        // Get recent users
        $recentUsers = User::with('role')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->full_name,
                    'email' => $user->email,
                    'role' => $user->role?->name ?? 'N/A',
                    'avatar' => $user->avatar,
                    'date' => $user->created_at?->format('Y-m-d'),
                ];
            });

        // Get active projects
        $activeProjects = Project::where('status', 1)
            ->with('diploma')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'diploma' => $project->diploma?->name ?? 'N/A',
                    'seats' => $project->seats ?? 0,
                    'applications_count' => $project->applications()->count(),
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentApplications' => $recentApplications,
            'recentUsers' => $recentUsers,
            'activeProjects' => $activeProjects,
        ]);
    }
}
