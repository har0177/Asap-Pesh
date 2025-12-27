<?php

namespace App\Http\Controllers\Student;

use App\Enums\ReligionEnum;
use App\Enums\TaxonomyTypeEnum;
use App\Helpers\Notify;
use App\Helpers\Response;
use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Taxonomy;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ProfileController extends Controller
{
    /**
     * Show the student profile form
     */
    public function index(): InertiaResponse
    {
        $user = auth()->user();
        $student = $user->student;

        // Get dropdown options
        $genders = Taxonomy::whereType(TaxonomyTypeEnum::GENDER)->get()
            ->map(fn($t) => ['id' => $t->id, 'label' => $t->name]);

        $provinces = Taxonomy::whereType(TaxonomyTypeEnum::PROVINCE)->get()
            ->map(fn($t) => ['id' => $t->id, 'label' => $t->name]);

        $bloodGroups = Taxonomy::whereType(TaxonomyTypeEnum::BLOODGROUP)->get()
            ->map(fn($t) => ['id' => $t->id, 'label' => $t->name]);

        $religions = collect(ReligionEnum::cases())->map(fn($r) => [
            'id' => $r->value,
            'label' => $r->name,
        ]);

        // Get districts if province is selected
        $districts = [];
        if ($student?->province_id) {
            $districts = Taxonomy::whereType(TaxonomyTypeEnum::DISTRICT)
                ->where('parent_id', $student->province_id)
                ->get()
                ->map(fn($t) => ['id' => $t->id, 'label' => $t->name]);
        }

        // Get uploaded documents
        $documents = [
            'cnic' => $user->getFirstMediaUrl('cnic'),
            'domicile' => $user->getFirstMediaUrl('domicile'),
            'dmc' => $user->getFirstMediaUrl('dmc'),
        ];

        return Inertia::render('Student/Profile', [
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'username' => $user->username,
                'cnic' => $user->cnic,
                'avatar' => $user->avatar,
            ],
            'student' => $student ? [
                'address' => $student->address,
                'postal_address' => $student->postal_address,
                'father_name' => $student->father_name,
                'father_contact' => $student->father_contact,
                'dob' => $student->dob,
                'gender_id' => $student->gender_id,
                'district_id' => $student->district_id,
                'blood_group_id' => $student->blood_group_id,
                'province_id' => $student->province_id,
                'emergency_contact' => $student->emergency_contact,
                'religion' => $student->religion?->value,
                'hostel' => $student->hostel,
                'hafiz_quran' => $student->hafiz_quran,
                'profile_status' => $student->profile_status,
            ] : null,
            'genders' => $genders,
            'provinces' => $provinces,
            'districts' => $districts,
            'bloodGroups' => $bloodGroups,
            'religions' => $religions,
            'documents' => $documents,
            'hasActiveApplications' => $user->applications()->count() > 0,
        ]);
    }

    /**
     * Get districts by province
     */
    public function getDistricts(Request $request)
    {
        $provinceId = $request->input('province_id');

        $districts = Taxonomy::whereType(TaxonomyTypeEnum::DISTRICT)
            ->where('parent_id', $provinceId)
            ->orderBy('name')
            ->get()
            ->map(fn($t) => ['id' => $t->id, 'label' => $t->name]);

        return response()->json([
            'success' => true,
            'data' => $districts,
        ]);
    }

    /**
     * Update student profile
     */
    public function update(Request $request)
    {
        $user = auth()->user();

        // Block updates if has active applications
        if ($user->applications()->count() > 0) {
            Notify::error('You cannot update your profile due to active applications.');
            return back()->withErrors(['profile' => 'You cannot update your profile due to active applications.']);
        }

        // Validate user fields
        $validated = $request->validate([
            'first_name' => 'required|min:2|max:50',
            'last_name' => 'required|min:2|max:50',
            'username' => 'required|min:3|max:8|unique:users,username,' . $user->id,
            'phone' => 'required|numeric|digits:11|unique:users,phone,' . $user->id,
            'email' => 'nullable|email|max:255|unique:users,email,' . $user->id,
            'cnic' => 'required|numeric|digits:13|unique:users,cnic,' . $user->id,
            'image' => 'nullable|image|max:1024|mimes:png,jpg,jpeg',
            // Student fields
            'address' => 'required|string|max:255',
            'postal_address' => 'nullable|string|max:255',
            'father_name' => 'required|string|max:100',
            'father_contact' => 'required|numeric|digits:11',
            'dob' => 'required|date|before:today',
            'gender_id' => 'required|exists:taxonomies,id',
            'district_id' => 'required|exists:taxonomies,id',
            'blood_group_id' => 'required|exists:taxonomies,id',
            'province_id' => 'required|exists:taxonomies,id',
            'emergency_contact' => 'nullable|numeric|digits:11',
            'religion' => 'required|in:Islam,Minority',
            'hostel' => 'boolean',
            'hafiz_quran' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            // Avatar is optional during initial profile setup
            // TODO: Make avatar required before final submission
            // if (!$user->hasMedia('avatars') && !$request->hasFile('image')) {
            //     return back()->withErrors(['image' => 'Please upload your image.']);
            // }

            // Handle image upload
            if ($request->hasFile('image')) {
                $user->clearMediaCollection('avatars');
                $user->addMedia($request->file('image'))->toMediaCollection('avatars');
            }

            // Update user
            $user->update([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'username' => $validated['username'],
                'phone' => $validated['phone'],
                'email' => $validated['email'],
                'cnic' => $validated['cnic'],
            ]);

            // Update or create student record
            $studentData = [
                'gender_id' => $validated['gender_id'],
                'father_name' => $validated['father_name'],
                'father_contact' => $validated['father_contact'],
                'dob' => $validated['dob'],
                'blood_group_id' => $validated['blood_group_id'],
                'address' => $validated['address'],
                'postal_address' => $validated['postal_address'],
                'district_id' => $validated['district_id'],
                'province_id' => $validated['province_id'],
                'emergency_contact' => $validated['emergency_contact'],
                'religion' => $validated['religion'],
                'hostel' => $validated['hostel'] ?? false,
                'hafiz_quran' => $validated['hafiz_quran'] ?? false,
                'profile_status' => 1,
            ];

            if ($user->student) {
                $user->student->update($studentData);
            } else {
                $studentData['user_id'] = $user->id;
                $studentData['status'] = 'Pending';
                Student::create($studentData);
            }

            DB::commit();

            Notify::success('Profile updated successfully.');

            return redirect()->route('student.education')
                ->with('success', 'Profile updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Notify::error('An error occurred: ' . $e->getMessage());
            return back()->withErrors(['error' => 'An error occurred while updating profile.']);
        }
    }
}
