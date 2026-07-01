<?php

namespace App\Http\Resources;

use App\Http\Resources\User\ProfileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskNoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'content' => $this->resource->content,
            'owner' => $this->resource->owner
                ? (new ProfileResource($this->resource->owner))->toArray($request)
                : null,
            'is_owner' => $this->resource->owner?->id === auth()->id(),
//            'created_at' => $this->resource->created_at,
//            'updated_at' => $this->resource->updated_at,
        ];
    }
}
