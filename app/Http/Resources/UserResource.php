<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Determine if this is a listing request (minimal data) or detail request (full data)
        $isListingRequest = str_contains($request->path(), '/listing');

        // For listing page, return minimal data for performance
        if ($isListingRequest) {
            return [
                'id' => $this->id,
                'full_name' => $this->full_name,
                'first_name' => $this->first_name,
                'last_name' => $this->last_name,
                'email' => $this->email,
                'phone' => $this->phone,
                'role' => $this->whenLoaded('role', fn() => $this->role?->name),
                'role_id' => $this->role_id,
                'avatar' => $this->avatar,
                'email_verified_at' => $this->email_verified_at?->format('Y-m-d'),
                'created_at' => $this->created_at?->format('Y-m-d'),
                'deleted_at' => $this->deleted_at?->format('Y-m-d'),
            ];
        }

        // For detail/edit requests, return full data
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
            'student' => $this->whenLoaded('student', fn() => new StudentResource($this->student)),
            'applications' => $this->whenLoaded('applications', fn() => ApplicationResource::collection($this->applications)),
            'email_verified_at' => $this->email_verified_at?->format('Y-m-d H:i'),
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i'),
            'deleted_at' => $this->deleted_at?->format('Y-m-d H:i'),
            'is_root_user' => $this->isRootUser(),
        ];
    }
}
