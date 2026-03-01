<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
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
            'name' => $this->name,
            'guard_name' => $this->guard_name,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),

            // Sertakan permissions jika relasi dimuat
            $this->mergeWhen($this->relationLoaded('permissions'), [
                'permissions' => $this->permissions->map(fn ($perm) => [
                    'id' => $perm->id,
                    'name' => $perm->name,
                ]),
            ]),
        ];
    }
}
