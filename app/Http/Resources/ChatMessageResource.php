<?php

namespace App\Http\Resources;

use App\Http\Resources\User\ProfileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatMessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'content' => $this->resource->content,
            'owner' => $this->resource->owner
                ? (new ProfileResource($this->resource->owner))->toArray($request)
                : null,
            'is_owner' => $this->resource->user_id === auth()->user()->id,
            'reply_to' => $this->resource->replyTo ? [
                'id' => $this->resource->replyTo->id,
                'content' => $this->resource->replyTo->content,
                'owner' => $this->resource->replyTo->owner
                    ? (new ProfileResource($this->resource->replyTo->owner))->toArray($request)
                    : null,
            ] : null,
            'edited' => ! $this->resource->created_at->equalTo($this->resource->updated_at),
            // created_at/updated_at are Carbon instances (Eloquent auto-casts timestamp columns), whose
            // default JSON shape is ISO 8601 - unlike Task::due_at, an uncast column that stays in the raw
            // DB 'Y-m-d H:i:s' string laravelDateToJsDate() expects. Format explicitly to match.
            'created_at' => $this->resource->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->resource->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
