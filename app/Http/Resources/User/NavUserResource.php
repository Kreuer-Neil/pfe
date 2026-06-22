<?php

namespace App\Http\Resources\User;

use App\Http\Resources\Project\ProjectContextResource;
use Illuminate\Http\Request;

class NavUserResource extends ProfileResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'projects' => ProjectContextResource::collection($this->resource->projects)->toArray($request),
        ]);
    }

}
