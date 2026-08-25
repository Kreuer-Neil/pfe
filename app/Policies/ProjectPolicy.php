<?php

namespace App\Policies;

use App\Enums\ProjectRole;
use App\Models\Project;
use App\Models\ProjectNews;
use App\Models\User;

class ProjectPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct() {}

    public function view(User $user, Project $project): bool
    {
        return $project->userIsMember($user)
            || ((! $project->is_private) && $project->userRole($user) !== ProjectRole::BANNED->value);
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

    /**
     * Whether $user may manage (change the role of, or ban) $target within $project at all,
     * ignoring what the new role would be. Encodes the hierarchy:
     * - nobody manages themselves
     * - nobody but the owner manages the owner
     * - the owner manages anyone else regardless of role
     * - otherwise, admin/moderator manage strictly lower-ranked members only (peers can't
     *   manage each other, and a role can never manage or outrank itself)
     */
    private function canManageMember(User $user, Project $project, User $target): bool
    {
        $targetRole = ProjectRole::tryFrom($project->userRole($target));
        if ($targetRole === null) {
            return false;
        }

        if ($user->id === $target->id) {
            return false;
        }

        if ($target->id === $project->owner_id) {
            return false;
        }

        if ($user->id === $project->owner_id) {
            return true;
        }

        $actorRole = ProjectRole::tryFrom($project->userRole($user));
        if (! in_array($actorRole, [ProjectRole::ADMIN, ProjectRole::MODERATOR], true)) {
            return false;
        }

        return $actorRole->rank() > $targetRole->rank();
    }

    public function updateMemberRole(User $user, Project $project, User $target, ProjectRole $newRole): bool
    {
        // Banning has its own dedicated action/policy method.
        if ($newRole === ProjectRole::BANNED) {
            return false;
        }

        if (! $this->canManageMember($user, $project, $target)) {
            return false;
        }

        if ($user->id === $project->owner_id) {
            return true;
        }

        $actorRole = ProjectRole::from($project->userRole($user));

        return $newRole->rank() < $actorRole->rank();
    }

    public function banMember(User $user, Project $project, User $target): bool
    {
        return $this->canManageMember($user, $project, $target);
    }

    public function manageInvitations(User $user, Project $project): bool
    {
        return in_array($project->userRole($user), [ProjectRole::ADMIN->value, ProjectRole::MODERATOR->value]);
    }

    /**
     * Whether $user may generate a new invitation link. Defaults to any member when the
     * project's permissions row allows it (or doesn't exist yet); otherwise admin/moderator only.
     */
    public function createInvitation(User $user, Project $project): bool
    {
        $allowAnyMember = $project->permissions?->allow_members_invitations ?? true;

        return $allowAnyMember
            ? $project->userIsMember($user)
            : $this->manageInvitations($user, $project);
    }

    public function createNews(User $user, Project $project): bool
    {
        return in_array($project->userRole($user), [ProjectRole::ADMIN->value, ProjectRole::MODERATOR->value]);
    }

    /**
     * Mirrors ChatMessagePolicy::delete()'s own-author-OR-admin/moderator shape.
     */
    public function deleteNews(User $user, Project $project, ProjectNews $news): bool
    {
        if ($news->user_id === $user->id) {
            return true;
        }

        return in_array($project->userRole($user), [ProjectRole::MODERATOR->value, ProjectRole::ADMIN->value]);
    }

    /**
     * Task managers are included here (unlike createNews) since polls are a task/activity
     * coordination tool, not a project-wide announcement.
     */
    public function createPoll(User $user, Project $project): bool
    {
        return in_array($project->userRole($user), [
            ProjectRole::ADMIN->value,
            ProjectRole::MODERATOR->value,
            ProjectRole::TASK_MANAGER->value,
        ]);
    }

    public function votePoll(User $user, Project $project): bool
    {
        return $project->userIsMember($user);
    }
}
