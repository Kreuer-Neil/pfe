<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'first_name' => $this->resource->first_name,
            'last_name' => $this->resource->last_name,
            'nickname' => $this->resource->nickname,
            'pronouns' => $this->resource->pronouns,
            'avatar' => $this->resource->avatar,
            'bio' => $this->resource->bio,
            'is_following' => auth()->user()->follows()
                ->where('followed_user_id', $this->resource->id)
                ->exists(),
        ];
    }
}
