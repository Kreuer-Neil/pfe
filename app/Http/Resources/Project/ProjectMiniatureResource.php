<?php

namespace App\Http\Resources\Project;

use App\Http\Resources\TagRessourceCollection;
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
            'coordinates' => $this->resource->coordinates,
            'place' => $this->resource->place(),
            'tags' => (new TagRessourceCollection($this->resource->tags()->get()))->toArray($request),
            'is_member' => $this->resource->userIsMember(auth()->user()),
            'members_count' => $this->resource->members->count(),
        ]);
    }
}
