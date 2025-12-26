<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
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
                'slug' => $this->slug,
                'description' => $this->description,
                'permissions_count' => is_array($this->permissions) ? count($this->permissions) : 0,
                'users_count' => $this->users_count ?? 0,
                'created_at' => $this->created_at?->format('Y-m-d'),
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'permissions' => $this->permissions ?? [],
            'users_count' => $this->users_count ?? $this->users()->count(),
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i'),
        ];
    }
}
