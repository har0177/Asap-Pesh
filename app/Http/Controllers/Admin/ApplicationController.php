<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TaxonomyTypeEnum;
use App\Exports\ApplicationsExport;
use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Models\Student;
use App\Models\Taxonomy;
use App\Models\User;
use App\Traits\HasListing;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Maatwebsite\Excel\Facades\Excel;

class ApplicationController extends Controller
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
                Application::class,
                ['user.student', 'project.diploma'],
                ApplicationResource::class
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
        return Inertia::render('Admin/Applications/Listing');
    }

    public function show(Request $request, Application $application)
    {
        $application->load([
            'user.student.diploma',
            'user.student.district',
            'user.education',
            'project.diploma',
        ]);

        if ($request->wantsJson()) {
            return Response::success([
                'application' => new ApplicationResource($application),
            ]);
        }

        return Inertia::render('Admin/Applications/Show', [
            'application' => new ApplicationResource($application),
        ]);
    }

    public function updateStatus(Request $request, Application $application)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Paid,Rejected,Approved',
            'remarks' => 'nullable|string|max:500',
        ]);

        $application->update($validated);

        Notify::success('Application status updated successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'application' => new ApplicationResource($application->load(['user', 'project'])),
            ]);
        }

        return redirect()->back()
            ->with('success', 'Application status updated successfully.');
    }

    public function destroy(Request $request, Application $application)
    {
        $application->delete();

        Notify::success('Application deleted successfully.');

        if ($request->wantsJson()) {
            return Response::success();
        }

        return redirect()->route('admin.applications.index')
            ->with('success', 'Application deleted successfully.');
    }

    public function restore(Request $request, int $id)
    {
        $application = Application::withTrashed()->findOrFail($id);
        $application->restore();

        Notify::success('Application restored successfully.');

        if ($request->wantsJson()) {
            return Response::success([
                'application' => new ApplicationResource($application->load(['user', 'project'])),
            ]);
        }

        return redirect()->route('admin.applications.index')
            ->with('success', 'Application restored successfully.');
    }

    public function export(Request $request)
    {
        $filters = $request->only(['search', 'paid', 'quota_search', 'diploma_search']);

        return Excel::download(new ApplicationsExport($filters), 'applications-' . date('Y-m-d') . '.xlsx');
    }

    /**
     * Show admit form for an application
     */
    public function admitForm(Request $request, Application $application)
    {
        $application->load(['user.student', 'project.diploma']);

        $student = User::with('student')->findOrFail($application->user_id);

        // Get dropdown options
        $diplomas = Taxonomy::whereType(TaxonomyTypeEnum::DIPLOMA)->get()
            ->map(fn($t) => ['id' => $t->id, 'label' => $t->name]);

        $sessions = Taxonomy::whereType(TaxonomyTypeEnum::SESSION)->orderByDesc('id')->get()
            ->map(fn($t) => ['id' => $t->id, 'label' => $t->name]);

        $sections = Taxonomy::whereType(TaxonomyTypeEnum::SECTION)
            ->where('parent_id', $application->project->diploma_id)
            ->get()
            ->map(fn($t) => ['id' => $t->id, 'label' => $t->name]);

        // Generate suggested reg_no
        $suggestedRegNo = $this->generateRegNo();

        if ($request->wantsJson()) {
            return Response::success([
                'application' => new ApplicationResource($application),
                'student' => [
                    'id' => $student->id,
                    'first_name' => $student->first_name,
                    'last_name' => $student->last_name,
                    'avatar' => $student->avatar,
                ],
                'diplomas' => $diplomas,
                'sessions' => $sessions,
                'sections' => $sections,
                'diploma_id' => $application->project->diploma_id,
                'suggested_reg_no' => $suggestedRegNo,
                'admission_date' => Carbon::now()->format('Y-m-d'),
            ]);
        }

        return Inertia::render('Admin/Applications/Admit', [
            'application' => new ApplicationResource($application),
            'student' => [
                'id' => $student->id,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'avatar' => $student->avatar,
            ],
            'diplomas' => $diplomas,
            'sessions' => $sessions,
            'sections' => $sections,
            'diploma_id' => $application->project->diploma_id,
            'suggested_reg_no' => $suggestedRegNo,
            'admission_date' => Carbon::now()->format('Y-m-d'),
        ]);
    }

    /**
     * Admit a student from application
     */
    public function admit(Request $request, Application $application)
    {
        $validated = $request->validate([
            'reg_no' => 'required|unique:students,reg_no',
            'class_no' => 'required|numeric|min:1',
            'admission_date' => 'required|date',
            'diploma_id' => 'required|exists:taxonomies,id',
            'session_id' => 'required|exists:taxonomies,id',
            'section_id' => 'required|exists:taxonomies,id',
        ]);

        try {
            DB::beginTransaction();

            // Update student record
            $student = Student::where('user_id', $application->user_id)->first();

            if (!$student) {
                return back()->withErrors(['error' => 'Student record not found.']);
            }

            $student->update([
                'reg_no' => $validated['reg_no'],
                'class_no' => $validated['class_no'],
                'admission_date' => $validated['admission_date'],
                'diploma_id' => $validated['diploma_id'],
                'session_id' => $validated['session_id'],
                'section_id' => $validated['section_id'],
                'status' => 'Active',
            ]);

            // Update application status
            $application->update([
                'status' => 'Approved',
            ]);

            DB::commit();

            Notify::success('Student admitted successfully.');

            if ($request->wantsJson()) {
                return Response::success([
                    'message' => 'Student admitted successfully.',
                ]);
            }

            return redirect()->route('admin.applications.index')
                ->with('success', 'Student admitted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Notify::error('An error occurred: ' . $e->getMessage());
            return back()->withErrors(['error' => 'An error occurred while admitting student.']);
        }
    }

    /**
     * Get sections by diploma
     */
    public function getSections(Request $request)
    {
        $diplomaId = $request->input('diploma_id');

        $sections = Taxonomy::whereType(TaxonomyTypeEnum::SECTION)
            ->where('parent_id', $diplomaId)
            ->orderBy('name')
            ->get()
            ->map(fn($t) => ['id' => $t->id, 'label' => $t->name]);

        return response()->json([
            'success' => true,
            'data' => $sections,
        ]);
    }

    /**
     * Get next class number
     */
    public function getClassNumber(Request $request)
    {
        $diplomaId = $request->input('diploma_id');
        $sessionId = $request->input('session_id');
        $sectionId = $request->input('section_id');

        $lastStudent = Student::where('diploma_id', $diplomaId)
            ->where('session_id', $sessionId)
            ->where('section_id', $sectionId)
            ->orderByDesc('class_no')
            ->first();

        $nextClassNo = $lastStudent ? ($lastStudent->class_no + 1) : 1;

        return response()->json([
            'success' => true,
            'class_no' => $nextClassNo,
        ]);
    }

    /**
     * Generate a unique registration number
     */
    protected function generateRegNo(): string
    {
        $prefix = 'ASA';
        $year = date('y');

        // Get the last reg_no
        $lastStudent = Student::whereNotNull('reg_no')
            ->orderByDesc('id')
            ->first();

        if ($lastStudent && preg_match('/ASA(\d+)/', $lastStudent->reg_no, $matches)) {
            $lastNumber = (int) $matches[1];
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Update payment status
     */
    public function updatePaymentStatus(Request $request, Application $application)
    {
        $application->update([
            'status' => 'Paid',
        ]);

        Notify::success('Payment status updated to Paid.');

        if ($request->wantsJson()) {
            return Response::success([
                'application' => new ApplicationResource($application->load(['user', 'project'])),
            ]);
        }

        return redirect()->back()
            ->with('success', 'Payment status updated successfully.');
    }
}
