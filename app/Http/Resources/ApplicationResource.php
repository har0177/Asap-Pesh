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
            return [
                'id' => $this->id,
                'user_id' => $this->user_id,
                'project_id' => $this->project_id,
                'user' => $this->whenLoaded('user', fn() => [
                    'id' => $this->user->id,
                    'full_name' => $this->user->full_name,
                    'email' => $this->user->email,
                    'phone' => $this->user->phone,
                    'avatar' => $this->user->avatar,
                ]),
                'project' => $this->whenLoaded('project', fn() => [
                    'id' => $this->project->id,
                    'name' => $this->project->name,
                    'diploma' => $this->project->diploma?->name,
                ]),
                'status' => $this->status,
                'challan_no' => $this->challan_no,
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
