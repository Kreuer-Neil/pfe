<?php

namespace App\FormatedModels;

use App\FormatedModels\Project\FormatedProjectContext;
use App\Models\Task;
use App\Models\User;

class FormatedTaskMiniature
{
    public string $id;
    public ?FormatedProfile $owner;
    public ?bool $isOwner;
    public string $title;
    public string $description;
    public FormatedProjectContext $project;
    public int|null $min_participations;

    public int $participations_count;
    public array $related_users;
    public bool $self_participating;
    public ?string $starting_at;
    public ?string $due_at;
    public bool $hasNotes;
    public bool $validated;

    public function __construct(Task $task, User $currentUser)
    {
        $this->id = $task->id;
        $this->owner = new FormatedProfile($task->owner, $currentUser);
        $this->isOwner = ($ownerId = $task->owner->id) ? $ownerId === $currentUser->id : null;
        $this->title = $task->title;
//        $this->description = $task->description;
        $this->project = new FormatedProjectContext($task->project()->first(['id', 'name', 'icon', 'slug']));

        $this->min_participations = $task->min_participations;
        // Turns users model collection into profile data

        foreach($task->relatedUsers($currentUser) as $user) {
            $this->related_users[] = $user->toFormatedProfile(auth()->user());
        }

        $this->participations_count = $task->participations()->count();
// $this->participations_count = $task->loadCount('participatingUsers');

        $this->self_participating = $task->isParticipating($currentUser);
        $this->starting_at = $task->starting_at;
        $this->due_at = $task->due_at;
//        $this->created_at = $task->created_at;
//        $this->updated_at = $task->updated_at;

        $this->hasNotes = $task->notes()->count() >= 0;
        $this->validated = $task->validated_at !== null;
    }

}
