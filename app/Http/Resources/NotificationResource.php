<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'type' => class_basename($this->resource->type),
            'data' => $this->resource->data,
            'read_at' => (bool) $this->resource->read_at,
            'created_at' => $this->resource->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
