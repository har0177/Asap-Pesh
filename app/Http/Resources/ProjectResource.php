<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
                'name' => $this->name,
                'diploma' => $this->whenLoaded('diploma', fn() => $this->diploma?->name),
                'diploma_id' => $this->diploma_id,
                'seats' => $this->seats,
                'fee' => $this->fee,
                'deadline' => $this->deadline,
                'status' => $this->status,
                'applications_count' => $this->applications_count ?? 0,
                'created_at' => $this->created_at?->format('Y-m-d'),
                'deleted_at' => $this->deleted_at?->format('Y-m-d'),
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'diploma_id' => $this->diploma_id,
            'diploma' => $this->whenLoaded('diploma', fn() => [
                'id' => $this->diploma->id,
                'name' => $this->diploma->name,
            ]),
            'seats' => $this->seats,
            'fee' => $this->fee,
            'deadline' => $this->deadline,
            'status' => $this->status,
            'quota' => $this->quota ?? [],
            'quota_names' => $this->quotaName ?? [],
            'applications_count' => $this->applications_count ?? $this->applications()->count(),
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i'),
            'deleted_at' => $this->deleted_at?->format('Y-m-d H:i'),
        ];
    }
}
