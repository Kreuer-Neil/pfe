<?php

namespace App\Http\Resources\Project;

use App\Enums\ProjectRole;
use App\Http\Resources\User\ProfileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectShowresource extends ProjectMiniatureResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'description' => $this->resource->description,
            'members' => ProfileResource::collection($this->resource->members)->toArray($request),
            'user_role' => ProjectRole::VIEWER->value,
        ]);
    }
}
