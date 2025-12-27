<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Education;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DashboardController extends Controller
{
    /**
     * Show the student dashboard
     */
    public function index(): InertiaResponse
    {
        $user = auth()->user();
        $student = $user->student;

        // Profile completion status
        $profileStatus = [
            'complete' => $student?->profile_status == 1,
            'has_avatar' => $user->hasMedia('avatars'),
            'has_cnic' => $user->hasMedia('cnic'),
            'has_domicile' => $user->hasMedia('domicile'),
            'has_dmc' => $user->hasMedia('dmc'),
        ];

        // Calculate profile completion percentage
        $profileItems = [
            $student?->profile_status == 1,
            $user->hasMedia('avatars'),
            $user->hasMedia('cnic'),
            $user->hasMedia('domicile'),
            $user->hasMedia('dmc'),
        ];
        $profileCompletionPercent = (int) ((array_sum(array_map('intval', $profileItems)) / count($profileItems)) * 100);

        // Education records
        $educations = Education::where('user_id', $user->id)
            ->with('degree')
            ->get()
            ->map(fn($edu) => [
                'id' => $edu->id,
                'degree' => $edu->degree?->name,
                'board' => $edu->board,
                'percentage' => $edu->percentage,
                'grade' => $edu->grade,
            ]);

        // Applications
        $applications = Application::where('user_id', $user->id)
            ->with(['project.diploma'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($app) => [
                'id' => $app->id,
                'application_number' => $app->application_number,
                'project_name' => $app->project?->diploma?->name,
                'status' => $app->status,
                'created_at' => $app->created_at->format('M d, Y'),
                'has_challan' => $app->hasMedia('challan'),
            ]);

        // Statistics
        $stats = [
            'total_applications' => $applications->count(),
            'pending_applications' => $applications->where('status', 'Pending')->count(),
            'paid_applications' => $applications->where('status', 'Paid')->count(),
            'education_records' => $educations->count(),
        ];

        return Inertia::render('Student/Dashboard', [
            'user' => [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
                'avatar' => $user->avatar,
            ],
            'student' => $student ? [
                'status' => $student->status,
                'diploma' => $student->diploma?->name,
                'session' => $student->session?->name,
            ] : null,
            'profileStatus' => $profileStatus,
            'profileCompletionPercent' => $profileCompletionPercent,
            'educations' => $educations,
            'applications' => $applications,
            'stats' => $stats,
        ]);
    }
}
