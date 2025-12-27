<?php

namespace App\Http\Controllers\Student;

use App\Enums\TaxonomyTypeEnum;
use App\Helpers\Notify;
use App\Http\Controllers\Controller;
use App\Models\Education;
use App\Models\Taxonomy;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class EducationController extends Controller
{
    /**
     * Show education records page
     */
    public function index(): InertiaResponse
    {
        $user = auth()->user();

        // Check if profile is complete
        if (!$user->student?->profile_status) {
            Notify::error('Please complete your profile first.');
            return Inertia::location(route('student.profile'));
        }

        // Get education records
        $educations = Education::where('user_id', $user->id)
            ->with('degree')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Get degree dropdown options
        $degrees = Taxonomy::whereType(TaxonomyTypeEnum::DEGREE)->get()
            ->map(fn($t) => ['id' => $t->id, 'label' => $t->name]);

        return Inertia::render('Student/Education', [
            'educations' => $educations,
            'degrees' => $degrees,
            'hasActiveApplications' => $user->applications()->count() > 0,
        ]);
    }

    /**
     * Store a new education record
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        // Block if has active applications
        if ($user->applications()->count() > 0) {
            Notify::error('You cannot add education due to active applications.');
            return back()->withErrors(['education' => 'You cannot add education due to active applications.']);
        }

        $validated = $request->validate([
            'degree_id' => 'required|exists:taxonomies,id',
            'board' => ['required', 'min:2', 'max:50', 'regex:/^[\pL\s]+$/u'],
            'obtained_marks' => 'required|numeric|min:1|max:9999',
            'total_marks' => 'required|numeric|min:1|max:9999',
            'result_declaration_date' => 'required|date|before:today',
            'grade' => 'required|string|max:10',
            'roll_number' => 'required|string|max:50',
        ], [
            'board.regex' => 'Board name must contain only alphabets and spaces.',
        ]);

        // Validate marks
        if ($validated['obtained_marks'] > $validated['total_marks']) {
            return back()->withErrors(['obtained_marks' => 'Obtained marks cannot exceed total marks.']);
        }

        // Check for duplicate degree
        $existingEducation = Education::where('degree_id', $validated['degree_id'])
            ->where('user_id', $user->id)
            ->first();

        if ($existingEducation) {
            return back()->withErrors(['degree_id' => 'You have already added this degree.']);
        }

        // Calculate percentage
        $percentage = round(($validated['obtained_marks'] / $validated['total_marks']) * 100, 2);

        try {
            Education::create([
                'user_id' => $user->id,
                'degree_id' => $validated['degree_id'],
                'board' => $validated['board'],
                'obtained_marks' => $validated['obtained_marks'],
                'total_marks' => $validated['total_marks'],
                'percentage' => $percentage,
                'result_declaration_date' => $validated['result_declaration_date'],
                'grade' => $validated['grade'],
                'roll_number' => $validated['roll_number'],
            ]);

            Notify::success('Education added successfully.');

            return back()->with('success', 'Education added successfully.');

        } catch (\Exception $e) {
            Notify::error('An error occurred while saving education.');
            return back()->withErrors(['error' => 'An error occurred while saving education.']);
        }
    }

    /**
     * Update an education record
     */
    public function update(Request $request, Education $education)
    {
        $user = auth()->user();

        // Verify ownership
        if ($education->user_id !== $user->id) {
            abort(403);
        }

        // Block if has active applications
        if ($user->applications()->count() > 0) {
            Notify::error('You cannot update education due to active applications.');
            return back()->withErrors(['education' => 'You cannot update education due to active applications.']);
        }

        $validated = $request->validate([
            'degree_id' => 'required|exists:taxonomies,id',
            'board' => ['required', 'min:2', 'max:50', 'regex:/^[\pL\s]+$/u'],
            'obtained_marks' => 'required|numeric|min:1|max:9999',
            'total_marks' => 'required|numeric|min:1|max:9999',
            'result_declaration_date' => 'required|date|before:today',
            'grade' => 'required|string|max:10',
            'roll_number' => 'required|string|max:50',
        ], [
            'board.regex' => 'Board name must contain only alphabets and spaces.',
        ]);

        // Validate marks
        if ($validated['obtained_marks'] > $validated['total_marks']) {
            return back()->withErrors(['obtained_marks' => 'Obtained marks cannot exceed total marks.']);
        }

        // Check for duplicate degree (excluding current record)
        $existingEducation = Education::where('degree_id', $validated['degree_id'])
            ->where('user_id', $user->id)
            ->where('id', '!=', $education->id)
            ->first();

        if ($existingEducation) {
            return back()->withErrors(['degree_id' => 'You have already added this degree.']);
        }

        // Calculate percentage
        $percentage = round(($validated['obtained_marks'] / $validated['total_marks']) * 100, 2);

        try {
            $education->update([
                'degree_id' => $validated['degree_id'],
                'board' => $validated['board'],
                'obtained_marks' => $validated['obtained_marks'],
                'total_marks' => $validated['total_marks'],
                'percentage' => $percentage,
                'result_declaration_date' => $validated['result_declaration_date'],
                'grade' => $validated['grade'],
                'roll_number' => $validated['roll_number'],
            ]);

            Notify::success('Education updated successfully.');

            return back()->with('success', 'Education updated successfully.');

        } catch (\Exception $e) {
            Notify::error('An error occurred while updating education.');
            return back()->withErrors(['error' => 'An error occurred while updating education.']);
        }
    }

    /**
     * Delete an education record
     */
    public function destroy(Education $education)
    {
        $user = auth()->user();

        // Verify ownership
        if ($education->user_id !== $user->id) {
            abort(403);
        }

        // Block if has active applications
        if ($user->applications()->count() > 0) {
            Notify::error('You cannot delete education due to active applications.');
            return back()->withErrors(['education' => 'You cannot delete education due to active applications.']);
        }

        try {
            $education->delete();

            Notify::success('Education deleted successfully.');

            return back()->with('success', 'Education deleted successfully.');

        } catch (\Exception $e) {
            Notify::error('An error occurred while deleting education.');
            return back()->withErrors(['error' => 'An error occurred while deleting education.']);
        }
    }
}
