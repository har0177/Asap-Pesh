<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
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
                'email' => $this->email,
                'phone' => $this->phone,
                'designation' => $this->designation,
                'department' => $this->department,
                'avatar' => $this->avatar,
                'gender' => $this->whenLoaded('gender', fn() => $this->gender?->name),
                'gender_id' => $this->gender_id,
                'blood_group' => $this->whenLoaded('bloodGroup', fn() => $this->bloodGroup?->name),
                'blood_group_id' => $this->blood_group_id,
                'status' => $this->status ?? true,
                'created_at' => $this->created_at?->format('Y-m-d'),
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'designation' => $this->designation,
            'department' => $this->department,
            'address' => $this->address,
            'avatar' => $this->avatar,
            'gender_id' => $this->gender_id,
            'blood_group_id' => $this->blood_group_id,
            'gender' => $this->whenLoaded('gender', fn() => [
                'id' => $this->gender->id,
                'name' => $this->gender->name,
            ]),
            'blood_group' => $this->whenLoaded('bloodGroup', fn() => [
                'id' => $this->bloodGroup->id,
                'name' => $this->bloodGroup->name,
            ]),
            'status' => $this->status ?? true,
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i'),
        ];
    }
}
