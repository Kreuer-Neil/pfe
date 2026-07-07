<?php

namespace App\Http\Resources\Project;

use Gate;
use Illuminate\Http\Request;

/**
 * Used only by ProjectController::edit() - home for fields that are only ever needed on the
 * settings page (starting with invitations, which contain live join codes and must not leak
 * into the shared ProjectResource also returned to any ordinary member via show()).
 */
class ProjectSettingsResource extends ProjectResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'invitations' => Gate::allows('manageInvitations', $this->resource)
                ? ProjectInvitationResource::collection(
                    $this->resource->invitations()->orderByDesc('created_at')->get()
                )->toArray($request)
                : [],
        ]);
    }
}