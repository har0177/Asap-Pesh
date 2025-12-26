<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    /**
     * JSON listing for DataGridTable (AG Grid)
     */
    public function listing(Request $request): JsonResponse
    {
        $query = Application::with(['user', 'project.diploma']);

        // Handle soft deleted
        if ($request->boolean('soft_deleted')) {
            $query->onlyTrashed();
        }

        // Handle search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('challan_no', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%")
                            ->orWhere('cnic', 'like', "%{$search}%");
                    })
                    ->orWhereHas('project', function ($pq) use ($search) {
                        $pq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Handle filterTree from GlobalFilter
        if ($request->filled('filterTree')) {
            $filterTree = $request->filterTree;
            if (!empty($filterTree['conditions'])) {
                $this->applyFilterTree($query, $filterTree);
            }
        }

        // Handle sorting
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

        $applications = $query->paginate($pageSize, ['*'], 'page', $currentPage);

        $data = $applications->getCollection()->map(function ($application) {
            return [
                'id' => $application->id,
                'user_id' => $application->user_id,
                'project_id' => $application->project_id,
                'user' => [
                    'id' => $application->user?->id,
                    'full_name' => $application->user?->full_name,
                    'email' => $application->user?->email,
                    'phone' => $application->user?->phone,
                    'cnic' => $application->user?->cnic,
                    'avatar' => $application->user?->avatar,
                ],
                'project' => [
                    'id' => $application->project?->id,
                    'name' => $application->project?->name,
                    'diploma' => [
                        'id' => $application->project?->diploma?->id,
                        'name' => $application->project?->diploma?->name,
                    ],
                ],
                'status' => $application->status,
                'quota' => $application->quotaName ?? [],
                'challan_no' => $application->challan_no,
                'remarks' => $application->remarks,
                'created_at' => $application->created_at?->format('Y-m-d'),
                'updated_at' => $application->updated_at?->format('Y-m-d'),
                'deleted_at' => $application->deleted_at?->format('Y-m-d'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
            'total' => $applications->total(),
            'pagination' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'per_page' => $applications->perPage(),
                'total' => $applications->total(),
            ],
        ]);
    }

    /**
     * Apply filter tree from GlobalFilter component
     */
    protected function applyFilterTree($query, array $filterTree): void
    {
        $type = $filterTree['type'] ?? 'AND';
        $conditions = $filterTree['conditions'] ?? [];

        $query->where(function ($q) use ($conditions, $type) {
            foreach ($conditions as $condition) {
                if (isset($condition['conditions'])) {
                    $this->applyFilterTree($q, $condition);
                } else {
                    $field = $condition['field'] ?? null;
                    $operator = $condition['operator'] ?? 'is';
                    $value = $condition['value'] ?? null;

                    if ($field && $value !== null) {
                        $method = strtolower($type) === 'or' ? 'orWhere' : 'where';

                        if ($field === 'project_id' || $field === 'status') {
                            $q->$method($field, is_array($value) ? $value[0] : $value);
                        } else {
                            $q->$method($field, 'like', "%{$value}%");
                        }
                    }
                }
            }
        });
    }

    public function index(Request $request): Response
    {
        // Render the new AG Grid listing page
        return Inertia::render('Admin/Applications/Listing');
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

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Application status updated successfully.',
            ]);
        }

        return redirect()->back()
            ->with('success', 'Application status updated successfully.');
    }

    public function destroy(Request $request, Application $application)
    {
        $application->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Application deleted successfully.',
            ]);
        }

        return redirect()->route('v2.admin.applications.index')
            ->with('success', 'Application deleted successfully.');
    }

    public function restore(Request $request, int $id)
    {
        $application = Application::withTrashed()->findOrFail($id);
        $application->restore();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Application restored successfully.',
            ]);
        }

        return redirect()->route('v2.admin.applications.index')
            ->with('success', 'Application restored successfully.');
    }

    public function export(Request $request)
    {
        // This will use the existing ApplicationsExport class
        // For now, redirect back with message
        return redirect()->back()
            ->with('info', 'Export functionality will be implemented.');
    }
}
