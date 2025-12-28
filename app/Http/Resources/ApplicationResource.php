<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $isListingRequest = str_contains($request->path(), '/listing');

        if ($isListingRequest) {
            // Check if user is admitted (has active student status with reg_no)
            $isAdmitted = false;
            if ($this->relationLoaded('user') && $this->user && $this->user->relationLoaded('student')) {
                $student = $this->user->student;
                $isAdmitted = $student && $student->status === 'Active' && !empty($student->reg_no);
            }

            return [
                'id' => $this->id,
                'user_id' => $this->user_id,
                'project_id' => $this->project_id,
                'user' => $this->whenLoaded('user', fn() => [
                    'id' => $this->user->id,
                    'full_name' => $this->user->full_name,
                    'father_name' => $this->user->student?->father_name ?? null,
                    'email' => $this->user->email,
                    'phone' => $this->user->phone,
                    'cnic' => $this->user->student?->cnic ?? null,
                    'avatar' => $this->user->avatar,
                ]),
                'project' => $this->whenLoaded('project', fn() => [
                    'id' => $this->project->id,
                    'name' => $this->project->name,
                    'diploma' => [
                        'id' => $this->project->diploma?->id,
                        'name' => $this->project->diploma?->name,
                    ],
                    'diploma_id' => $this->project->diploma_id,
                ]),
                'status' => $this->status,
                'is_admitted' => $isAdmitted,
                'quota' => $this->quotaName ?? [],
                'challan_no' => $this->challan_no,
                'challan_url' => $this->getFirstMediaUrl('challan') ?: null,
                'fee' => $this->project?->fee ?? 0,
                'created_at' => $this->created_at?->format('Y-m-d'),
                'deleted_at' => $this->deleted_at?->format('Y-m-d'),
            ];
        }

        // Check if user is admitted
        $isAdmitted = false;
        if ($this->relationLoaded('user') && $this->user && $this->user->relationLoaded('student')) {
            $student = $this->user->student;
            $isAdmitted = $student && $student->status === 'Active' && !empty($student->reg_no);
        }

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'project_id' => $this->project_id,
            'user' => $this->whenLoaded('user', fn() => [
                'id' => $this->user->id,
                'full_name' => $this->user->full_name,
                'first_name' => $this->user->first_name,
                'last_name' => $this->user->last_name,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
                'avatar' => $this->user->avatar,
                'cnic_url' => $this->user->getFirstMediaUrl('cnic') ?: null,
                'domicile_url' => $this->user->getFirstMediaUrl('domicile') ?: null,
                'dmc_url' => $this->user->getFirstMediaUrl('dmc') ?: null,
                'student' => $this->user->student ? [
                    'id' => $this->user->student->id,
                    'father_name' => $this->user->student->father_name,
                    'cnic' => $this->user->student->cnic,
                    'dob' => $this->user->student->dob,
                    'gender' => $this->user->student->gender?->name ?? null,
                    'address' => $this->user->student->address,
                    'district' => $this->user->student->district ? [
                        'id' => $this->user->student->district->id,
                        'name' => $this->user->student->district->name,
                    ] : null,
                ] : null,
                'education' => $this->user->education?->map(fn($edu) => [
                    'id' => $edu->id,
                    'degree' => $edu->degree?->name ?? $edu->degree ?? null,
                    'institute' => $edu->institute,
                    'board' => $edu->board,
                    'passing_year' => $edu->passing_year,
                    'obtained_marks' => $edu->obtained_marks,
                    'total_marks' => $edu->total_marks,
                ]) ?? [],
            ]),
            'project' => $this->whenLoaded('project', fn() => [
                'id' => $this->project->id,
                'name' => $this->project->name,
                'fee' => $this->project->fee,
                'diploma' => $this->project->diploma ? [
                    'id' => $this->project->diploma->id,
                    'name' => $this->project->diploma->name,
                ] : null,
            ]),
            'status' => $this->status,
            'is_admitted' => $isAdmitted,
            'quota' => $this->quotaName ?? [],
            'challan_no' => $this->challan_no,
            'challan_url' => $this->getFirstMediaUrl('challan') ?: null,
            'remarks' => $this->remarks,
            'documents' => $this->getMedia('documents')->map(fn($media) => [
                'id' => $media->id,
                'name' => $media->name,
                'url' => $media->getUrl(),
                'type' => $media->mime_type,
            ]),
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i'),
            'deleted_at' => $this->deleted_at?->format('Y-m-d H:i'),
        ];
    }
}
