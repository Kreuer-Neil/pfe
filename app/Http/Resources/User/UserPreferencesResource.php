<?php

namespace App\Http\Resources\User;

use App\Http\Resources\TagRessourceCollection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserPreferencesResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'languages' => $this->resource->languages->pluck('name'),
            'tags' => $this->resource->tags->pluck('name'),
            'place' => $this->resource->location?->display_name,
        ];
    }
}
