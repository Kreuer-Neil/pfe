<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;

class UserResource extends ProfileResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // TODO add necessary properties when showing user
        return array_merge(parent::toArray($request), [
        ]);
    }
}
