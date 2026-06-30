<?php

namespace App\Policies;

use App\Enums\ProjectRole;
use App\Models\User;
use App\Models\Project;

class ProjectPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {

    }

    public function view(User $user, Project $project): bool
    {
        return $project->userIsMember($user)
            || ((!$project->is_private) && $project->userRole($user) !== ProjectRole::BANNED->value);
    }

    public function updateAppearance(User $user, Project $project): bool
    {
        return in_array($project->userRole($user), [ProjectRole::ADMIN->value, ProjectRole::MODERATOR->value]);
    }

    public function update(User $user, Project $project): bool
    {
        return $project->userRole($user) === ProjectRole::ADMIN->value;
    }

    public function viewData(User $user, Project $project): bool
    {
        return $project->userIsMember($user);
    }

    public function storeTask(User $user, Project $project): bool
    {
        return in_array($project->userRole($user), [ProjectRole::ADMIN->value, ProjectRole::MODERATOR->value, ProjectRole::TASK_MANAGER->value]);
    }

    public function updateMemberRole(User $user, Project $project): bool
    {
        return $project->userRole($user) === ProjectRole::ADMIN->value;
    }
}
