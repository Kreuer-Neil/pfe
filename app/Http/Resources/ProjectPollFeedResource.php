<?php

namespace App\Http\Resources;

use App\Http\Resources\Project\ProjectContextResource;
use Illuminate\Http\Request;

class ProjectPollFeedResource extends ProjectPollResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'project' => (new ProjectContextResource($this->resource->project))->toArray($request),
        ]);
    }
}
