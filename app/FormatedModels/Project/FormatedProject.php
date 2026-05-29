<?php

namespace App\FormatedModels\Project;

use App\FormatedModels\FormatedProfile;
use App\FormatedModels\FormatedTaskMiniature;
use App\Models\Project;
use App\Models\User;

class FormatedProject extends FormatedProjectContext
{

    public string $id;
    public string $name;
    public string $icon;
    public string $description;

    public User $owner;
    public array $members;
    public string $user_role;

    public bool $isMember;

    public int $members_count;
    public array $upcoming_tasks;

    public function __construct(Project $project, User $user)
    {
        parent::__construct($project);
        $this->description = $project->description;

        $this->owner = User::find($project->owner_id);
        $this->members = [];
        foreach ($project->members as $member) {
            $this->members[] = new FormatedProfile($member);
        }

        $this->upcoming_tasks = [];
        foreach ($project->upcomingTasks as $task) {
            $this->upcoming_tasks[] = new FormatedTaskMiniature($task, $user->id);
        }

        $this->user_role = $project->userRole($user);

        $this->members_count = $project->members->count();
    }
}
