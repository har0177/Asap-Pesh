<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TaxonomyTypeEnum;
use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use App\Models\Taxonomy;
use App\Traits\HasListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class StudentController extends Controller
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
                Student::class,
                ['user', 'diploma', 'section', 'session', 'district'],
                StudentResource::class
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
        return Inertia::render('Admin/Students/Listing');
    }

    public function show(Request $request, Student $student)
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

        if ($request->wantsJson()) {
            return Response::success([
                'student' => new StudentResource($student),
            ]);
        }

        return Inertia::render('Admin/Students/Show', [
            'student' => new StudentResource($student),
        ]);
    }

    public function edit(Student $student): InertiaResponse
    {
        $student->load(['user', 'diploma', 'section', 'session', 'gender', 'bloodGroup', 'district', 'province']);

        return Inertia::render('Admin/Students/Edit', [
            'student' => new StudentResource($student),
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

        Notify::success('Student updated successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'student' => new StudentResource($student->load(['user', 'diploma', 'section', 'session'])),
            ]);
        }

        return redirect()->route('admin.students.index')
            ->with('success', 'Student updated successfully.');
    }

    public function destroy(Request $request, Student $student)
    {
        $student->delete();

        Notify::success('Student deleted successfully.');

        if ($request->wantsJson()) {
            return Response::success();
        }

        return redirect()->route('admin.students.index')
            ->with('success', 'Student deleted successfully.');
    }

    public function restore(Request $request, int $id)
    {
        $student = Student::withTrashed()->findOrFail($id);
        $student->restore();

        Notify::success('Student restored successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'student' => new StudentResource($student->load(['user', 'diploma', 'section', 'session'])),
            ]);
        }

        return redirect()->route('admin.students.index')
            ->with('success', 'Student restored successfully.');
    }
}
