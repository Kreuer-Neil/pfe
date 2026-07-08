<?php

namespace App\Http\Resources\Project;

use Illuminate\Http\Request;
use Str;

class ProjectMiniatureResource extends ProjectContextResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'description' => Str::limit(value: $this->resource->description, preserveWords: true),
            'location' => $this->resource->location,
            'place' => $this->resource->place(),
            'distance' => $this->resource->distance,
            'tags' => $this->resource->tags()->pluck('name'),
            'is_member' => $this->resource->userIsMember(auth()->user()),
            'members_count' => $this->resource->members->count(),
        ]);
    }
}
