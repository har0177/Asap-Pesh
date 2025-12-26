<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'roll_no' => $this->roll_no,
            'father_name' => $this->father_name,
            'dob' => $this->dob,
            'religion' => $this->religion?->value,
            'address' => $this->address,
            'user' => $this->whenLoaded('user', fn() => [
                'id' => $this->user->id,
                'full_name' => $this->user->full_name,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
                'cnic' => $this->user->cnic,
                'avatar' => $this->user->avatar,
            ]),
            'diploma' => $this->whenLoaded('diploma', fn() => [
                'id' => $this->diploma?->id,
                'name' => $this->diploma?->name,
            ]),
            'session' => $this->whenLoaded('session', fn() => [
                'id' => $this->session?->id,
                'name' => $this->session?->name,
            ]),
            'section' => $this->whenLoaded('section', fn() => [
                'id' => $this->section?->id,
                'name' => $this->section?->name,
            ]),
            'gender' => $this->whenLoaded('gender', fn() => [
                'id' => $this->gender?->id,
                'name' => $this->gender?->name,
            ]),
            'blood_group' => $this->whenLoaded('bloodGroup', fn() => [
                'id' => $this->bloodGroup?->id,
                'name' => $this->bloodGroup?->name,
            ]),
            'district' => $this->whenLoaded('district', fn() => [
                'id' => $this->district?->id,
                'name' => $this->district?->name,
            ]),
            'province' => $this->whenLoaded('province', fn() => [
                'id' => $this->province?->id,
                'name' => $this->province?->name,
            ]),
            'created_at' => $this->created_at?->format('Y-m-d'),
            'updated_at' => $this->updated_at?->format('Y-m-d'),
            'deleted_at' => $this->deleted_at?->format('Y-m-d'),
        ];
    }
}
