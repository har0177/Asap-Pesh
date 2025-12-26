<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TaxonomyTypeEnum;
use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use App\Models\Taxonomy;
use App\Traits\HasListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class EmployeeController extends Controller
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
                Employee::class,
                ['gender', 'bloodGroup'],
                EmployeeResource::class
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
        return Inertia::render('Admin/Employees/Listing');
    }

    public function create(): InertiaResponse
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

        Notify::success('Employee created successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'employee' => new EmployeeResource($employee->load(['gender', 'bloodGroup'])),
            ]);
        }

        return redirect()->route('admin.employees.index')
            ->with('success', 'Employee created successfully.');
    }

    public function show(Request $request, Employee $employee)
    {
        $employee->load(['gender', 'bloodGroup']);

        if ($request->wantsJson()) {
            return Response::success([
                'employee' => new EmployeeResource($employee),
            ]);
        }

        return Inertia::render('Admin/Employees/Show', [
            'employee' => new EmployeeResource($employee),
        ]);
    }

    public function edit(Employee $employee): InertiaResponse
    {
        $genders = Taxonomy::where('type', TaxonomyTypeEnum::GENDER)->get(['id', 'name']);
        $bloodGroups = Taxonomy::where('type', TaxonomyTypeEnum::BLOODGROUP)->get(['id', 'name']);

        return Inertia::render('Admin/Employees/Edit', [
            'employee' => new EmployeeResource($employee->load(['gender', 'bloodGroup'])),
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

        Notify::success('Employee updated successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'employee' => new EmployeeResource($employee->load(['gender', 'bloodGroup'])),
            ]);
        }

        return redirect()->route('admin.employees.index')
            ->with('success', 'Employee updated successfully.');
    }

    public function destroy(Request $request, Employee $employee)
    {
        $employee->delete();

        Notify::success('Employee deleted successfully.');

        if ($request->wantsJson()) {
            return Response::success();
        }

        return redirect()->route('admin.employees.index')
            ->with('success', 'Employee deleted successfully.');
    }
}
