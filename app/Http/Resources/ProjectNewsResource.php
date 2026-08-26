<?php

namespace App\Http\Resources;

use App\Http\Resources\User\ProfileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectNewsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'text_content' => $this->resource->text_content,
            'created_at' => $this->resource->created_at,
            'author' => $this->resource->author
                ? (new ProfileResource($this->resource->author))->toArray($request)
                : null,
        ];
    }
}
