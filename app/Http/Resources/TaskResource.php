<?php

namespace App\Http\Resources;

use App\Http\Resources\Project\ProjectContextResource;
use App\Http\Resources\TaskNoteResource;
use App\Http\Resources\User\ProfileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'description' => $this->resource->description,
            'owner' => $this->resource->owner
                ? new ProfileResource($this->resource->owner)
                : null,
            'is_owner' => $this->resource->owner?->id === auth()->user()->id,
// TODO add ProjectContext & Project etc.
            'project' => (new ProjectContextResource(
                $this->resource->project()->first(['id', 'name', 'icon', 'slug'])
            ))->toArray($request),
            'min_participations' => $this->resource->min_participations,
            'participations_count' => $this->resource->participations()->count(),
            'related_users' => ProfileResource::collection($this->resource->relatedUsers(auth()->user()))->toArray($request),
            'self_participating' => $this->resource->isParticipating(auth()->user()),
            'starting_at' => $this->resource->starting_at,
            'due_at' => $this->resource->due_at,
            'validated' => $this->resource->validated_at !== null,
            'notes' => TaskNoteResource::collection($this->resource->notes)->toArray($request),
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
        ];
    }
}
