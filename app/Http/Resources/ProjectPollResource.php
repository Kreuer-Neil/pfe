<?php

namespace App\Http\Resources;

use App\Http\Resources\User\ProfileResource;
use App\Models\ProjectPoll;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectPollResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var ProjectPoll $poll */
        $poll = $this->resource;
        $user = $request->user();

        $canSeeResults = $user && $poll->canSeeResults($user);
        $totalVoters = $canSeeResults ? $poll->totalVoters() : 0;

        return [
            'id' => $poll->id,
            'title' => $poll->title,
            'multi' => $poll->multi,
            'end_date' => $poll->end_date,
            'created_at' => $poll->created_at,
            'user' => $poll->user ? (new ProfileResource($poll->user))->toArray($request) : null,
            'choices' => $poll->choices->map(fn ($choice) => [
                'id' => $choice->id,
                'label' => $choice->label,
                'count' => $canSeeResults ? $poll->participationsCount($choice->id) : 0,
                'percentage' => $canSeeResults && $totalVoters > 0
                    ? (int) round($poll->participationsCount($choice->id) / $totalVoters * 100)
                    : 0,
            ]),
            'total_voters' => $totalVoters,
            'is_expired' => $poll->isExpired(),
            'can_see_results' => $canSeeResults,
            'user_choice_ids' => $user ? $poll->userChoiceIds($user) : [],
            'user_skipped' => $user && $poll->userSkipped($user),
        ];
    }
}
