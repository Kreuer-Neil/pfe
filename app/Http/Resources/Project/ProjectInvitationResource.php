<?php

namespace App\Http\Resources\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectInvitationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'code' => $this->resource->code,
            'max_uses' => $this->resource->max_uses,
            'used_count' => $this->resource->used_count,
            'remaining_uses' => $this->resource->remaining_uses,
            'is_valid' => $this->resource->isValid(),
            'expires_at' => $this->resource->expires_at,
            'created_at' => $this->resource->created_at,
        ];
    }
}