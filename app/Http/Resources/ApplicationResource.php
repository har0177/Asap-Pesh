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
                    'diploma' => $this->project->diploma?->name,
                    'diploma_id' => $this->project->diploma_id,
                ]),
                'status' => $this->status,
                'is_admitted' => $isAdmitted,
                'quota' => $this->quotaName ?? [],
                'challan_no' => $this->challan_no,
                'fee' => $this->project?->fee ?? 0,
                'created_at' => $this->created_at?->format('Y-m-d'),
                'deleted_at' => $this->deleted_at?->format('Y-m-d'),
            ];
        }

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'project_id' => $this->project_id,
            'user' => $this->whenLoaded('user', fn() => new UserResource($this->user)),
            'project' => $this->whenLoaded('project', fn() => new ProjectResource($this->project)),
            'status' => $this->status,
            'quota' => $this->quotaName ?? [],
            'challan_no' => $this->challan_no,
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
