<?php

namespace App\Http\Controllers\Student;

use App\Enums\TaxonomyTypeEnum;
use App\Helpers\Notify;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Project;
use App\Models\Taxonomy;
use App\Services\QuotaValidationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ApplyController extends Controller
{
    protected QuotaValidationService $quotaService;

    public function __construct(QuotaValidationService $quotaService)
    {
        $this->quotaService = $quotaService;
    }

    /**
     * Show the application page
     */
    public function index(): InertiaResponse
    {
        $user = auth()->user();
        $student = $user->student;

        // Check prerequisites
        $prerequisites = $this->checkPrerequisites($user);

        // Always show projects so users can see what's available
        // Apply button is disabled on frontend when prerequisites aren't met
        // Only show valid projects with diploma and quotas configured
        $projects = Project::with(['applications' => function ($query) use ($user) {
            $query->where('user_id', $user->id);
        }, 'diploma'])
            ->where('status', 1)
            ->whereNotNull('diploma_id')  // Must have a diploma
            ->whereNotNull('quota')       // Must have quotas configured
            ->where('quota', '!=', '[]')  // Not empty quota array
            ->where(function ($query) {
                $query->whereNull('deadline')
                    ->orWhere('deadline', '>=', now());
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($project) use ($student) {
                $eligibleQuotas = $this->quotaService->getEligibleQuotas(
                    $student,
                    $project->quota ?? []
                );

                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'diploma_name' => $project->diploma?->name,
                    'deadline' => $project->deadline,
                    'fee' => $project->fee,
                    'seats' => $project->seats,
                    'quota' => $project->quota ?? [],
                    'eligible_quotas' => $eligibleQuotas,
                    'has_applied' => $project->applications->isNotEmpty(),
                    'application' => $project->applications->first() ? [
                        'id' => $project->applications->first()->id,
                        'application_number' => $project->applications->first()->application_number,
                        'status' => $project->applications->first()->status,
                        'quota' => $project->applications->first()->quota,
                        'challan_url' => $project->applications->first()->getFirstMediaUrl('challan'),
                    ] : null,
                ];
            });

        // Get all quotas for display
        $quotaList = Taxonomy::whereType(TaxonomyTypeEnum::QUOTA)
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'name' => $t->name,
            ]);

        // Get document status
        $documents = [
            'cnic' => [
                'url' => $user->getFirstMediaUrl('cnic'),
                'uploaded' => $user->hasMedia('cnic'),
            ],
            'domicile' => [
                'url' => $user->getFirstMediaUrl('domicile'),
                'uploaded' => $user->hasMedia('domicile'),
            ],
            'dmc' => [
                'url' => $user->getFirstMediaUrl('dmc'),
                'uploaded' => $user->hasMedia('dmc'),
            ],
        ];

        return Inertia::render('Student/Apply', [
            'prerequisites' => $prerequisites,
            'projects' => $projects,
            'quotaList' => $quotaList,
            'documents' => $documents,
        ]);
    }

    /**
     * Check prerequisites for application
     */
    protected function checkPrerequisites($user): array
    {
        $student = $user->student;

        $checks = [
            'profile_complete' => [
                'passed' => $student?->profile_status == 1,
                'message' => 'Please complete your profile first.',
                'redirect' => route('student.profile'),
            ],
            'photo_uploaded' => [
                'passed' => $user->hasMedia('avatars'),
                'message' => 'Please upload your photo.',
                'redirect' => route('student.profile'),
            ],
            'education_added' => [
                'passed' => $user->education()->count() > 0,
                'message' => 'Please add at least one education record.',
                'redirect' => route('student.education'),
            ],
            'documents_uploaded' => [
                'passed' => $user->hasMedia('cnic') && $user->hasMedia('domicile') && $user->hasMedia('dmc'),
                'message' => 'Please upload all required documents (CNIC, Domicile, DMC).',
                'redirect' => null,
            ],
            'age_valid' => [
                'passed' => true,
                'message' => '',
                'redirect' => null,
            ],
        ];

        // Check age
        if ($student?->dob) {
            try {
                $dob = Carbon::parse($student->dob);
                $age = $dob->diffInYears(Carbon::now());

                if ($age > 20) {
                    $checks['age_valid'] = [
                        'passed' => false,
                        'message' => 'You must be 20 years old or younger to apply.',
                        'redirect' => route('student.profile'),
                    ];
                }
            } catch (\Exception $e) {
                $checks['age_valid'] = [
                    'passed' => false,
                    'message' => 'Invalid date of birth. Please update your profile.',
                    'redirect' => route('student.profile'),
                ];
            }
        } else {
            $checks['age_valid'] = [
                'passed' => false,
                'message' => 'Please add your date of birth in your profile.',
                'redirect' => route('student.profile'),
            ];
        }

        $allPassed = collect($checks)->every(fn($check) => $check['passed']);

        return [
            'passed' => $allPassed,
            'checks' => $checks,
        ];
    }

    /**
     * Upload documents
     */
    public function uploadDocuments(Request $request)
    {
        $request->validate([
            'domicile' => 'required|mimes:pdf|max:2048',
            'cnic' => 'required|mimes:pdf|max:2048',
            'dmc' => 'required|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user = auth()->user();

        try {
            if ($request->hasFile('domicile')) {
                $user->clearMediaCollection('domicile');
                $user->addMedia($request->file('domicile'))->toMediaCollection('domicile');
            }

            if ($request->hasFile('cnic')) {
                $user->clearMediaCollection('cnic');
                $user->addMedia($request->file('cnic'))->toMediaCollection('cnic');
            }

            if ($request->hasFile('dmc')) {
                $user->clearMediaCollection('dmc');
                $user->addMedia($request->file('dmc'))->toMediaCollection('dmc');
            }

            Notify::success('Documents uploaded successfully.');

            return back()->with('success', 'Documents uploaded successfully.');

        } catch (\Exception $e) {
            Notify::error('An error occurred while uploading documents.');
            return back()->withErrors(['error' => 'An error occurred while uploading documents.']);
        }
    }

    /**
     * Submit an application
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        $student = $user->student;

        // Check prerequisites
        $prerequisites = $this->checkPrerequisites($user);
        if (!$prerequisites['passed']) {
            return back()->withErrors(['error' => 'Please complete all prerequisites first.']);
        }

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'quota' => 'required|array|min:1',
            'quota.*' => 'exists:taxonomies,id',
        ]);

        // Check if already applied
        $existingApplication = Application::where('user_id', $user->id)
            ->where('project_id', $validated['project_id'])
            ->first();

        if ($existingApplication) {
            return back()->withErrors(['error' => 'You have already applied for this project.']);
        }

        // Validate quota selection
        $quotaErrors = $this->quotaService->validate($student, $validated['quota']);
        if (!empty($quotaErrors)) {
            return back()->withErrors(['quota' => implode(' ', $quotaErrors)]);
        }

        // Get project for application number
        $project = Project::with('diploma')->find($validated['project_id']);

        // Generate application number
        $applicationNumber = $this->generateApplicationNumber($project);

        try {
            DB::beginTransaction();

            Application::create([
                'user_id' => $user->id,
                'project_id' => $validated['project_id'],
                'application_number' => $applicationNumber,
                'quota' => $validated['quota'],
                'status' => 'Pending',
            ]);

            DB::commit();

            Notify::success('Application submitted successfully for ' . $project->diploma?->name);

            return back()->with('success', 'Application submitted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Notify::error('An error occurred while submitting application.');
            return back()->withErrors(['error' => 'An error occurred while submitting application.']);
        }
    }

    /**
     * Update an application (quota change)
     */
    public function update(Request $request, Application $application)
    {
        $user = auth()->user();

        // Verify ownership
        if ($application->user_id !== $user->id) {
            abort(403);
        }

        // Can't update paid applications
        if ($application->status === 'Paid') {
            return back()->withErrors(['error' => 'Cannot update a paid application.']);
        }

        $validated = $request->validate([
            'quota' => 'required|array|min:1',
            'quota.*' => 'exists:taxonomies,id',
        ]);

        // Validate quota selection
        $student = $user->student;
        $quotaErrors = $this->quotaService->validate($student, $validated['quota']);
        if (!empty($quotaErrors)) {
            return back()->withErrors(['quota' => implode(' ', $quotaErrors)]);
        }

        try {
            $application->update([
                'quota' => $validated['quota'],
            ]);

            Notify::success('Application updated successfully.');

            return back()->with('success', 'Application updated successfully.');

        } catch (\Exception $e) {
            Notify::error('An error occurred while updating application.');
            return back()->withErrors(['error' => 'An error occurred while updating application.']);
        }
    }

    /**
     * Upload challan for an application
     */
    public function uploadChallan(Request $request, Application $application)
    {
        $user = auth()->user();

        // Verify ownership
        if ($application->user_id !== $user->id) {
            abort(403);
        }

        $request->validate([
            'challan' => 'required|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        try {
            $application->clearMediaCollection('challan');
            $application->addMedia($request->file('challan'))->toMediaCollection('challan');

            Notify::success('Challan uploaded successfully.');

            return back()->with('success', 'Challan uploaded successfully.');

        } catch (\Exception $e) {
            Notify::error('An error occurred while uploading challan.');
            return back()->withErrors(['error' => 'An error occurred while uploading challan.']);
        }
    }

    /**
     * Generate application number
     */
    protected function generateApplicationNumber(Project $project): string
    {
        $diplomaName = $project->diploma?->name ?? 'APP';

        // Get acronym from diploma name
        $excludedWords = ['In', 'The', 'Of', 'in', 'the', 'of', 'and', 'And'];
        $words = explode(' ', $diplomaName);
        $acronym = '';

        foreach ($words as $word) {
            if (!in_array($word, $excludedWords) && !empty($word)) {
                $acronym .= mb_substr($word, 0, 1);
            }
        }

        if (empty($acronym)) {
            $acronym = 'APP';
        }

        $random = rand(1000, 9999);

        return strtoupper($acronym) . '-' . $project->id . '-' . $random;
    }
}
