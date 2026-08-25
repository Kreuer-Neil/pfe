<?php

namespace App\Http\Resources\Project;

use App\Http\Resources\ProjectNewsResource;
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
        $latestNews = $this->resource->news()->first();

        return array_merge(parent::toArray($request), [
            'description' => Str::limit(value: $this->resource->description, preserveWords: true),
            'location' => $this->resource->location,
            'place' => $this->resource->place(),
            'distance' => $this->resource->distance,
            'tags' => $this->resource->tags()->pluck('name'),
            'is_member' => $this->resource->userIsMember(auth()->user()),
            'members_count' => $this->resource->members->count(),
            'is_following' => auth()->check() && $this->resource->followedBy(auth()->user()),
            'news' => $latestNews ? (new ProjectNewsResource($latestNews))->toArray($request) : null,
        ]);
    }
}
