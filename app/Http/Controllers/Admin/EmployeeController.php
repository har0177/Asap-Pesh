<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TaxonomyTypeEnum;
use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Taxonomy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * JSON listing for DataGridTable (AG Grid)
     */
    public function listing(Request $request): JsonResponse
    {
        $query = Employee::with(['gender', 'bloodGroup']);

        // Handle search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('designation', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%");
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

        $employees = $query->paginate($pageSize, ['*'], 'page', $currentPage);

        $data = $employees->getCollection()->map(function ($employee) {
            return [
                'id' => $employee->id,
                'name' => $employee->name,
                'email' => $employee->email,
                'phone' => $employee->phone,
                'designation' => $employee->designation,
                'department' => $employee->department,
                'avatar' => $employee->avatar,
                'gender' => $employee->gender ? [
                    'id' => $employee->gender->id,
                    'name' => $employee->gender->name,
                ] : null,
                'blood_group' => $employee->bloodGroup ? [
                    'id' => $employee->bloodGroup->id,
                    'name' => $employee->bloodGroup->name,
                ] : null,
                'status' => $employee->status ?? true,
                'created_at' => $employee->created_at?->format('Y-m-d'),
                'updated_at' => $employee->updated_at?->format('Y-m-d'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
            'total' => $employees->total(),
            'pagination' => [
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
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
                        $q->$method($field, 'like', "%{$value}%");
                    }
                }
            }
        });
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Employees/Listing');
    }

    public function create(): Response
    {
        $genders = Taxonomy::where('type', TaxonomyTypeEnum::GENDER)->get(['id', 'name']);
        $bloodGroups = Taxonomy::where('type', TaxonomyTypeEnum::BLOODGROUP)->get(['id', 'name']);

        return Inertia::render('Admin/Employees/Create', [
            'genders' => $genders,
            'bloodGroups' => $bloodGroups,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'designation' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'gender_id' => 'nullable|exists:taxonomies,id',
            'blood_group_id' => 'nullable|exists:taxonomies,id',
            'address' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $employee = Employee::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Employee created successfully.',
            ]);
        }

        return redirect()->route('v2.admin.employees.index')
            ->with('success', 'Employee created successfully.');
    }

    public function show(Employee $employee): Response
    {
        $employee->load(['gender', 'bloodGroup']);

        return Inertia::render('Admin/Employees/Show', [
            'employee' => [
                'id' => $employee->id,
                'name' => $employee->name,
                'email' => $employee->email,
                'phone' => $employee->phone,
                'designation' => $employee->designation,
                'department' => $employee->department,
                'address' => $employee->address,
                'avatar' => $employee->avatar,
                'gender' => $employee->gender?->name,
                'blood_group' => $employee->bloodGroup?->name,
                'status' => $employee->status,
                'created_at' => $employee->created_at?->format('Y-m-d H:i'),
            ],
        ]);
    }

    public function edit(Employee $employee): Response
    {
        $genders = Taxonomy::where('type', TaxonomyTypeEnum::GENDER)->get(['id', 'name']);
        $bloodGroups = Taxonomy::where('type', TaxonomyTypeEnum::BLOODGROUP)->get(['id', 'name']);

        return Inertia::render('Admin/Employees/Edit', [
            'employee' => [
                'id' => $employee->id,
                'name' => $employee->name,
                'email' => $employee->email,
                'phone' => $employee->phone,
                'designation' => $employee->designation,
                'department' => $employee->department,
                'address' => $employee->address,
                'gender_id' => $employee->gender_id,
                'blood_group_id' => $employee->blood_group_id,
                'status' => $employee->status,
            ],
            'genders' => $genders,
            'bloodGroups' => $bloodGroups,
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'designation' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'gender_id' => 'nullable|exists:taxonomies,id',
            'blood_group_id' => 'nullable|exists:taxonomies,id',
            'address' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $employee->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Employee updated successfully.',
            ]);
        }

        return redirect()->route('v2.admin.employees.index')
            ->with('success', 'Employee updated successfully.');
    }

    public function destroy(Request $request, Employee $employee)
    {
        $employee->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Employee deleted successfully.',
            ]);
        }

        return redirect()->route('v2.admin.employees.index')
            ->with('success', 'Employee deleted successfully.');
    }
}
