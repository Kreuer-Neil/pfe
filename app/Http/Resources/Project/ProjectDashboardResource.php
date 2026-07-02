<?php

namespace App\Http\Resources\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Str;

class ProjectDashboardResource extends ProjectContextResource
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
            'coordinates' => $this->resource->coordinates,
            'place' => $this->resource->place(),
            'members_count' => $this->resource->members->count(),
        ]);
    }

}
