<?php

namespace App\Http\Resources\Project;

use App\Enums\ProjectRole;
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
             // TODO replace with method and ways to get role and authorized actions directly
            'is_member' => $this->resource->members()
                    ->where('role', '!==', ProjectRole::BANNED->value)
                    ->find(auth()->id()) !== null,
            'members_count' => $this->resource->members->count(),
        ]);
    }

}
