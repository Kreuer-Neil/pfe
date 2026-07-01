<?php

namespace App\Http\Resources\Project;

use App\Http\Resources\TaskResource;
use App\Http\Resources\User\ProfileResource;
use App\Models\User;
use Illuminate\Http\Request;

class ProjectResource extends ProjectMiniatureResource
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
            'owner' => (new ProfileResource(User::find($this->resource->owner_id)))->toArray($request),
            'members' => ProfileResource::collection($this->resource->members)->toArray($request),
            'upcoming_tasks' => TaskResource::collection($this->resource->upcomingTasks)->toArray($request),
        ]);
    }

}
