<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TaxonomyTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use App\Models\Taxonomy;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * JSON listing for DataGridTable (AG Grid)
     */
    public function listing(Request $request): JsonResponse
    {
        $query = Student::with(['user', 'diploma', 'section', 'session', 'district']);

        // Handle soft deleted
        if ($request->boolean('soft_deleted')) {
            $query->onlyTrashed();
        }

        // Handle search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('father_name', 'like', "%{$search}%")
                    ->orWhere('roll_no', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%")
                            ->orWhere('cnic', 'like', "%{$search}%");
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

        $students = $query->paginate($pageSize, ['*'], 'page', $currentPage);

        return response()->json([
            'success' => true,
            'data' => StudentResource::collection($students->items()),
            'total' => $students->total(),
            'pagination' => [
                'current_page' => $students->currentPage(),
                'last_page' => $students->lastPage(),
                'per_page' => $students->perPage(),
                'total' => $students->total(),
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

                        if (in_array($field, ['diploma_id', 'section_id', 'session_id'])) {
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
        return Inertia::render('Admin/Students/Listing');
    }

    public function show(Student $student): Response
    {
        $student->load([
            'user.education',
            'user.applications.project',
            'diploma',
            'section',
            'session',
            'gender',
            'bloodGroup',
            'district',
            'province',
        ]);

        return Inertia::render('Admin/Students/Show', [
            'student' => [
                'id' => $student->id,
                'user' => [
                    'id' => $student->user?->id,
                    'full_name' => $student->user?->full_name,
                    'email' => $student->user?->email,
                    'phone' => $student->user?->phone,
                    'cnic' => $student->user?->cnic,
                    'avatar' => $student->user?->avatar,
                ],
                'father_name' => $student->father_name,
                'date_of_birth' => $student->date_of_birth,
                'religion' => $student->religion?->value ?? $student->religion,
                'address' => $student->address,
                'roll_no' => $student->roll_no,
                'diploma' => $student->diploma?->name,
                'section' => $student->section?->name,
                'session' => $student->session?->name,
                'gender' => $student->gender?->name,
                'blood_group' => $student->bloodGroup?->name,
                'district' => $student->district?->name,
                'province' => $student->province?->name,
                'education' => $student->user?->education?->map(function ($edu) {
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
                'applications' => $student->user?->applications?->map(function ($app) {
                    return [
                        'id' => $app->id,
                        'project' => $app->project?->name,
                        'status' => $app->status,
                        'created_at' => $app->created_at?->format('Y-m-d'),
                    ];
                }) ?? [],
                'created_at' => $student->created_at?->format('Y-m-d H:i'),
            ],
        ]);
    }

    public function edit(Student $student): Response
    {
        $student->load(['user', 'diploma', 'section', 'session', 'gender', 'bloodGroup', 'district', 'province']);

        // Get all taxonomy options
        $diplomas = Taxonomy::where('type', TaxonomyTypeEnum::DIPLOMA)->get(['id', 'name']);
        $sections = Taxonomy::where('type', TaxonomyTypeEnum::SECTION)->get(['id', 'name']);
        $sessions = Taxonomy::where('type', TaxonomyTypeEnum::SESSION)->get(['id', 'name']);
        $genders = Taxonomy::where('type', TaxonomyTypeEnum::GENDER)->get(['id', 'name']);
        $bloodGroups = Taxonomy::where('type', TaxonomyTypeEnum::BLOODGROUP)->get(['id', 'name']);
        $districts = Taxonomy::where('type', TaxonomyTypeEnum::DISTRICT)->get(['id', 'name']);
        $provinces = Taxonomy::where('type', TaxonomyTypeEnum::PROVINCE)->get(['id', 'name']);

        return Inertia::render('Admin/Students/Edit', [
            'student' => [
                'id' => $student->id,
                'user_id' => $student->user_id,
                'first_name' => $student->user?->first_name,
                'last_name' => $student->user?->last_name,
                'email' => $student->user?->email,
                'phone' => $student->user?->phone,
                'cnic' => $student->user?->cnic,
                'father_name' => $student->father_name,
                'date_of_birth' => $student->date_of_birth,
                'religion' => $student->religion?->value ?? $student->religion,
                'address' => $student->address,
                'roll_no' => $student->roll_no,
                'diploma_id' => $student->diploma_id,
                'section_id' => $student->section_id,
                'session_id' => $student->session_id,
                'gender_id' => $student->gender_id,
                'blood_group_id' => $student->blood_group_id,
                'district_id' => $student->district_id,
                'province_id' => $student->province_id,
            ],
            'diplomas' => $diplomas,
            'sections' => $sections,
            'sessions' => $sessions,
            'genders' => $genders,
            'bloodGroups' => $bloodGroups,
            'districts' => $districts,
            'provinces' => $provinces,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'father_name' => 'required|string|max:255',
            'date_of_birth' => 'nullable|date',
            'religion' => 'nullable|string',
            'address' => 'nullable|string',
            'roll_no' => 'nullable|string|max:50',
            'diploma_id' => 'nullable|exists:taxonomies,id',
            'section_id' => 'nullable|exists:taxonomies,id',
            'session_id' => 'nullable|exists:taxonomies,id',
            'gender_id' => 'nullable|exists:taxonomies,id',
            'blood_group_id' => 'nullable|exists:taxonomies,id',
            'district_id' => 'nullable|exists:taxonomies,id',
            'province_id' => 'nullable|exists:taxonomies,id',
        ]);

        // Update user
        $student->user->update([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'phone' => $validated['phone'] ?? null,
        ]);

        // Update student
        $student->update([
            'father_name' => $validated['father_name'],
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'religion' => $validated['religion'] ?? null,
            'address' => $validated['address'] ?? null,
            'roll_no' => $validated['roll_no'] ?? null,
            'diploma_id' => $validated['diploma_id'] ?? null,
            'section_id' => $validated['section_id'] ?? null,
            'session_id' => $validated['session_id'] ?? null,
            'gender_id' => $validated['gender_id'] ?? null,
            'blood_group_id' => $validated['blood_group_id'] ?? null,
            'district_id' => $validated['district_id'] ?? null,
            'province_id' => $validated['province_id'] ?? null,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Student updated successfully.',
            ]);
        }

        return redirect()->route('v2.admin.students.index')
            ->with('success', 'Student updated successfully.');
    }

    public function destroy(Request $request, Student $student)
    {
        $student->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Student deleted successfully.',
            ]);
        }

        return redirect()->route('v2.admin.students.index')
            ->with('success', 'Student deleted successfully.');
    }

    public function restore(Request $request, int $id)
    {
        $student = Student::withTrashed()->findOrFail($id);
        $student->restore();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Student restored successfully.',
            ]);
        }

        return redirect()->route('v2.admin.students.index')
            ->with('success', 'Student restored successfully.');
    }
}
