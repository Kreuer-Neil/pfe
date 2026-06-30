<?php

namespace App\Policies;

use App\Enums\ProjectRole;
use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {

    }

    public function joinTask(User $user, Task $task): bool
    {
        return $task->project()->first()->userIsMember($user);
    }

    public function validate(User $user, Task $task): bool
    {
        return $task->isParticipating($user);
    }

    public function update(User $user, Task $task): bool
    {
        return $task->owner->id === $user->id;
    }

    public function delete(User $user, Task $task): bool
    {
        return $task->owner->id === $user->id
            || in_array($task->project()->first()->userRole($user), [ProjectRole::MODERATOR, ProjectRole::ADMIN]);
    }
}
