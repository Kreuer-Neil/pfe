<?php

namespace App\FormatedModels;

use App\Models\Task;
use App\Models\User;

class FormatedTask
{
    public string $id;
    public ?User $owner;
    public string $title;
    public string $description;
    public string $project_id;
    public string $min_participations;
    public $participating_users;
    public bool $self_participating;
    public ?string $starting_at;
    public string $due_at;
    public string $created_at;
    public string $updated_at;

    public function __construct(Task $task, int $currentUserId)
    {
        $this->id = $task->id;
        $this->owner = $task->owner;
        $this->title = $task->title;
        $this->description = $task->description;
        $this->project_id = $task->project_id;
        $this->min_participations = $task->min_participations;
        // TODO change to profiles
        $this->participating_users = $task->participatingUsers($currentUserId);
        $this->self_participating = $task->isParticipating($currentUserId);
        $this->starting_at = $task->starting_at;
        $this->due_at = $task->due_at;
        $this->created_at = $task->created_at;
        $this->updated_at = $task->updated_at;
    }

}
