<?php

namespace App\Http\Resources\Project;

use App\Http\Resources\TaskResource;
use App\Http\Resources\User\MemberResource;
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
            'members' => MemberResource::collection($this->resource->members)->toArray($request),
            'is_private' => $this->resource->is_private,
            'upcoming_tasks' => TaskResource::collection($this->resource->upcomingTasks)->toArray($request),
        ]);
    }

}
