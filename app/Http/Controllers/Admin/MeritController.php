<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TaxonomyTypeEnum;
use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\MeritList;
use App\Models\Project;
use App\Models\Taxonomy;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class MeritController extends Controller
{
    /**
     * Show the merit list management page
     */
    public function index(Request $request): InertiaResponse
    {
        // Get recent projects (within last 5 days of expiry)
        $subDays = Carbon::parse(now())->subDays(5);
        $projects = Project::with('diploma')
            ->where('expiry_date', '>', $subDays)
            ->orderByDesc('id')
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->diploma?->name,
                'expiry_date' => $p->expiry_date,
            ]);

        // Get selected project's merit list if provided
        $selectedProject = $request->input('project');
        $meritData = null;

        if ($selectedProject) {
            $meritData = $this->getMeritData($selectedProject);
        }

        return Inertia::render('Admin/MeritList/Index', [
            'projects' => $projects,
            'selectedProject' => $selectedProject,
            'meritData' => $meritData,
        ]);
    }

    /**
     * Get merit data for a project
     */
    protected function getMeritData($projectId): array
    {
        $project = Project::with('diploma')->find($projectId);

        if (!$project) {
            return [];
        }

        // Get Open Merit list
        $openMerit = MeritList::where('project_id', $projectId)
            ->whereNotNull('merit_number')
            ->with(['user.student.district', 'user.education'])
            ->orderBy('merit_number')
            ->get()
            ->map(fn($m) => [
                'merit_number' => $m->merit_number,
                'user_id' => $m->user_id,
                'name' => $m->user?->first_name . ' ' . $m->user?->last_name,
                'father_name' => $m->user?->student?->father_name,
                'district' => $m->user?->student?->district?->name,
                'percentage' => $m->user?->education?->first()?->percentage,
            ]);

        // Get District-wise merit
        $districtMerit = MeritList::where('project_id', $projectId)
            ->whereNotNull('district_number')
            ->with(['user.student', 'district'])
            ->orderBy('district_id')
            ->orderBy('district_number')
            ->get()
            ->groupBy('district_id')
            ->map(function ($items, $districtId) {
                $district = Taxonomy::find($districtId);
                return [
                    'district_name' => $district?->name,
                    'students' => $items->map(fn($m) => [
                        'district_number' => $m->district_number,
                        'user_id' => $m->user_id,
                        'name' => $m->user?->first_name . ' ' . $m->user?->last_name,
                        'father_name' => $m->user?->student?->father_name,
                    ])->values(),
                ];
            })->values();

        return [
            'project_name' => $project->diploma?->name,
            'open_merit' => $openMerit,
            'district_merit' => $districtMerit,
            'total_applicants' => Application::where('project_id', $projectId)->count(),
        ];
    }

    /**
     * Generate merit list for a project
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
        ]);

        $projectId = $validated['project_id'];

        try {
            DB::beginTransaction();

            // Get districts and quotas
            $districts = Taxonomy::whereType(TaxonomyTypeEnum::DISTRICT)->get();
            $quotas = Taxonomy::whereType(TaxonomyTypeEnum::QUOTA)
                ->where('id', '!=', 33) // Exclude Open Merit quota
                ->get();

            // STEP 1: Generate Open Merit (quota_id = 33)
            $this->generateOpenMerit($projectId);

            // STEP 2: Generate District-wise Merit
            $this->generateDistrictMerit($projectId, $districts);

            // STEP 3: Generate Special Quota Merit
            $this->generateQuotaMerit($projectId, $quotas);

            DB::commit();

            Notify::success('Merit list generated successfully.');

            return redirect()->route('admin.merit.index', ['project' => $projectId])
                ->with('success', 'Merit list generated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Notify::error('An error occurred: ' . $e->getMessage());
            return back()->withErrors(['error' => 'An error occurred while generating merit list.']);
        }
    }

    /**
     * Generate Open Merit list
     */
    protected function generateOpenMerit($projectId): void
    {
        $openQuotaId = 33; // Open Merit quota ID

        // Get all applicants for Open Merit
        $userIds = Application::whereJsonContains('quota', (string) $openQuotaId)
            ->where('project_id', $projectId)
            ->pluck('user_id')
            ->toArray();

        // Fetch users with their education and calculate merit
        $usersList = User::whereIn('id', $userIds)
            ->whereHas('student', function ($query) {
                $query->where('status', 'Pending');
            })
            ->whereHas('education', function ($query) {
                $query->where('percentage', '>', 0);
            })
            ->get()
            ->filter(function ($user) {
                return $user->education->isNotEmpty();
            })
            ->map(function ($user) {
                $education = $user->education->first();
                $hifzMarks = $user->student->hifz_marks ?? 0;
                $percentage = (($education->obtained_marks + $hifzMarks) / $education->total_marks) * 100;

                return [
                    'user_id' => $user->id,
                    'percentage' => $percentage,
                ];
            })
            ->sortByDesc('percentage')
            ->values()
            ->all();

        // Save merit list
        foreach ($usersList as $key => $user) {
            MeritList::updateOrCreate(
                [
                    'user_id' => $user['user_id'],
                    'project_id' => $projectId,
                ],
                [
                    'quota_id' => $openQuotaId,
                    'merit_number' => $key + 1,
                ]
            );
        }
    }

    /**
     * Generate District-wise Merit list
     */
    protected function generateDistrictMerit($projectId, $districts): void
    {
        foreach ($districts as $district) {
            $usersList = User::whereHas('student', function ($query) use ($district) {
                    $query->where('district_id', $district->id)
                          ->where('status', 'Pending');
                })
                ->whereHas('applications', function ($query) use ($projectId) {
                    $query->where('project_id', $projectId);
                })
                ->whereHas('education', function ($query) {
                    $query->where('percentage', '>', 0);
                })
                ->get()
                ->filter(function ($user) {
                    return $user->education->isNotEmpty();
                })
                ->map(function ($user) {
                    $education = $user->education->first();
                    $hifzMarks = $user->student->hifz_marks ?? 0;
                    $percentage = (($education->obtained_marks + $hifzMarks) / $education->total_marks) * 100;

                    return [
                        'user_id' => $user->id,
                        'percentage' => $percentage,
                    ];
                })
                ->sortByDesc('percentage')
                ->values()
                ->all();

            // Save district merit
            foreach ($usersList as $key => $user) {
                MeritList::updateOrCreate(
                    [
                        'user_id' => $user['user_id'],
                        'project_id' => $projectId,
                    ],
                    [
                        'district_id' => $district->id,
                        'district_number' => $key + 1,
                    ]
                );
            }
        }
    }

    /**
     * Generate Special Quota Merit list
     */
    protected function generateQuotaMerit($projectId, $quotas): void
    {
        foreach ($quotas as $quota) {
            $userIds = Application::whereJsonContains('quota', (string) $quota->id)
                ->where('project_id', $projectId)
                ->pluck('user_id')
                ->toArray();

            $usersList = User::whereIn('id', $userIds)
                ->whereHas('student', function ($query) {
                    $query->where('status', 'Pending');
                })
                ->whereHas('education', function ($query) {
                    $query->where('percentage', '>', 0);
                })
                ->get()
                ->filter(function ($user) {
                    return $user->education->isNotEmpty();
                })
                ->map(function ($user) {
                    $education = $user->education->first();
                    $hifzMarks = $user->student->hifz_marks ?? 0;
                    $percentage = (($education->obtained_marks + $hifzMarks) / $education->total_marks) * 100;

                    return [
                        'user_id' => $user->id,
                        'percentage' => $percentage,
                    ];
                })
                ->sortByDesc('percentage')
                ->values()
                ->all();

            // Save quota merit
            foreach ($usersList as $key => $user) {
                MeritList::updateOrCreate(
                    [
                        'user_id' => $user['user_id'],
                        'project_id' => $projectId,
                        'quota_id' => $quota->id,
                    ],
                    [
                        'merit_number' => $key + 1,
                    ]
                );
            }
        }
    }

    /**
     * Clear merit list for a project
     */
    public function clear(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
        ]);

        MeritList::where('project_id', $validated['project_id'])->delete();

        Notify::success('Merit list cleared successfully.');

        return redirect()->route('admin.merit.index')
            ->with('success', 'Merit list cleared successfully.');
    }
}
