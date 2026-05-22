<?php

namespace App\FormatedModels;

use App\FormatedModels\Project\FormatedProjectContext;
use App\Models\Task;
use App\Models\User;

class FormatedTask extends FormatedTaskMiniature
{
    public string $id;
    public string $title;
    public string $description;
    public FormatedProjectContext $project;
    public int|null $min_participations;
    public int $participations_count;
    public array $participating_users;
    public array $notes;
    public bool $self_participating;
    public ?string $starting_at;
    public ?string $due_at;
    public string $created_at;
    public string $updated_at;

    public function __construct(Task $task, int $currentUserId)
    {
        parent::__construct($task, $currentUserId);
        $this->description = $task->description;
        $this->project = new FormatedProjectContext($task->project()->first(['id', 'name', 'icon', 'slug']));

        // Turns users model collection into profile data
        $this->participating_users = [];
        foreach ($task->participatingUsers($currentUserId)->get() as $user) {
            $this->participating_users[] = new FormatedProfile($user);
        }

        // TODO eager load related users and notes and proj
        $this->notes = [];
        /*foreach ($task->notes as $note) {
            $this->notes[] = new FormatedNote($note);
        }*/

        $this->participations_count = $task->participatingUsers($currentUserId)->count();

        $this->self_participating = $task->isParticipating($currentUserId);
        $this->starting_at = $task->starting_at;
        $this->due_at = $task->due_at;
        $this->created_at = $task->created_at;
        $this->updated_at = $task->updated_at;
    }
}
