<?php

namespace App\Http\Resources\Project;

use App\Http\Resources\ProjectPollResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\User\MemberResource;
use App\Http\Resources\User\ProfileResource;
use App\Models\User;
use Gate;
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
            'can_invite' => Gate::allows('createInvitation', $this->resource),
            'upcoming_tasks' => TaskResource::collection($this->resource->upcomingTasks)->toArray($request),
            'polls' => ProjectPollResource::collection($this->resource->polls()->where('end_date', '>=', now()->subMonth())->get())->toArray($request),
            'can_create_poll' => Gate::allows('createPoll', $this->resource),
        ]);
    }
}
