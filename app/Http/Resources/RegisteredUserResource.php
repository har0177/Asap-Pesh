<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RegisteredUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Determine if this is a listing request
        $isListingRequest = str_contains($request->path(), '/listing');

        // For listing page, return minimal data for performance
        if ($isListingRequest) {
            return [
                'id' => $this->id,
                'full_name' => $this->full_name,
                'first_name' => $this->first_name,
                'last_name' => $this->last_name,
                'father_name' => $this->student?->father_name,
                'email' => $this->email,
                'phone' => $this->phone,
                'cnic' => $this->cnic,
                'avatar' => $this->avatar,
                'status' => $this->student?->status ?? 'Pending',
                'email_verified_at' => $this->email_verified_at?->format('Y-m-d'),
                'created_at' => $this->created_at?->format('Y-m-d'),
            ];
        }

        // For detail requests, return full data
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'cnic' => $this->cnic,
            'avatar' => $this->avatar,
            'role_id' => $this->role_id,
            'role' => $this->whenLoaded('role', fn() => [
                'id' => $this->role->id,
                'name' => $this->role->name,
            ]),
            'student' => $this->whenLoaded('student', fn() => [
                'id' => $this->student->id,
                'father_name' => $this->student->father_name,
                'father_contact' => $this->student->father_contact,
                'dob' => $this->student->dob,
                'address' => $this->student->address,
                'postal_address' => $this->student->postal_address,
                'hostel' => $this->student->hostel,
                'hafiz_quran' => $this->student->hafiz_quran,
                'religion' => $this->student->religion,
                'status' => $this->student->status,
                'district' => $this->student->district?->name,
                'province' => $this->student->province?->name,
                'gender' => $this->student->gender?->name,
            ]),
            'education' => $this->whenLoaded('education', fn() => $this->education->map(fn($edu) => [
                'id' => $edu->id,
                'degree' => $edu->degree?->name,
                'board' => $edu->board,
                'roll_number' => $edu->roll_number,
                'obtained_marks' => $edu->obtained_marks,
                'total_marks' => $edu->total_marks,
                'percentage' => $edu->percentage,
                'result_declaration_date' => $edu->result_declaration_date,
            ])),
            'applications' => $this->whenLoaded('applications', fn() => ApplicationResource::collection($this->applications)),
            'email_verified_at' => $this->email_verified_at?->format('Y-m-d H:i'),
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i'),
        ];
    }
}
