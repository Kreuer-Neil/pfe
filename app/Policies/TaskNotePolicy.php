<?php

namespace App\Policies;

use App\Enums\ProjectRole;
use App\Models\TaskNote;
use App\Models\User;

class TaskNotePolicy
{
    public function update(User $user, TaskNote $note): bool
    {
        return $note->owner?->id === $user->id;
    }

    public function delete(User $user, TaskNote $note): bool
    {
        if ($note->owner?->id === $user->id) {
            return true;
        }

        $role = $note->task()->first()->project()->first()->userRole($user);

        return in_array($role, [ProjectRole::MODERATOR, ProjectRole::ADMIN]);
    }
}