<?php

namespace App\Http\Resources;

use App\Http\Resources\Project\ProjectContextResource;
use App\Http\Resources\User\ProfileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectPollResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'multi' => $this->resource->multi,
            'project' => (new ProjectContextResource($this->resource->project))->toArray($request),
            'user' => (new ProfileResource($this->resource->user))->toArray($request),
            'choices' => $this->resource->choices->map(fn ($choice) => [
                'id' => $choice->id,
                'label' => $choice->label,
                'count' => $this->resource->participationsCount($choice->id),
            ]),
            // TODO bind participants' profile + which choice(s) they picked, for a nice poll design.
            'participations' => [],
            'end_date' => $this->resource->end_date,
        ];
    }
}
