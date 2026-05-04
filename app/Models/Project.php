<?php

namespace App\Models;

use App\Enums\ProjectAction;
use App\Enums\ProjectInvitationResponse;
use App\Enums\ProjectPermissionResponse;
use App\Enums\ProjectRole;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

class Project extends Model
{
    use HasFactory;
    use SoftDeletes;

    //TODO: Slug as project identifier
    protected $fillable = ['owner_id', 'name', 'icon', 'description', 'status', 'slug', 'lang', 'coordinates', 'is_private'];

    /**
     * Returns
     */
    public function members(): BelongsToMany
    {
        return $this
            ->belongsToMany(User::class, Member::class)
            ->withPivot('role')
            ->where('banned', false);
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    public function tasks(): HasMany
    {
        return $this
            ->hasMany(Task::class)
            ->orderBy('due_at', 'asc');
    }

    public function upcomingTasks(): HasMany
    {
        return $this->tasks()
            ->where('due_at', '>=', Carbon::now());
    }

    /**
     * Shows the project's latest news
     */
//    public function news(): HasMany
//    {
//        return $this
//            ->hasMany(ProjectNews::class)
//            ->orderBy('created_at','desc');
//    }

    private function permission(User $user, ProjectAction $action): bool
    {
        // TODO make it dynamic with project settings separate "project_permission" table later
        if (($member = $this->members->find($user->id))) {
            $memberRole = $member->pivot->role;
            $returnValue = false;
            switch ($action) {
                case ProjectAction::BELONGS;
                    $returnValue = true;
                    break;
                case ProjectAction::MANAGE_TASK;
                    if (in_array($memberRole, [ProjectRole::TASK_MANAGER->value, ProjectRole::MODERATOR->value, ProjectRole::ADMIN->value,]))
                        $returnValue = true;
                    break;
                case ProjectAction::EDIT_SETTINGS;
                    if (in_array($memberRole, [ProjectRole::ADMIN->value,]))
                        $returnValue = true;
                    break;
            }
            return $returnValue;
        }

        return false;
    }

    public function userIsMember(User $user): bool
    {
        return $this->permission($user, ProjectAction::BELONGS);
    }

    public function addTask(Task $task, User $user): Task|null
    {
        if (!$this->permission($user, ProjectAction::MANAGE_TASK))
            return null;
        return Task::create([
            'user_id' => $user->id,
            'project_id' => $this->id,
            'title' => $task->title,
            'description' => $task->description,
            'min_participations' => $task->min_participations,
            'due_at' => $task->due_at,
            'starting_at' => $task->starting_at,
        ]);
    }

    public function joinAsMember(User $user, string $invitationCode = ''): ProjectInvitationResponse
    {
        // TODO use enum for "responses"
        // Check if user is already member
        if (!($membership = $this->memberships->where('user_id', '==', $user->id))->isEmpty()) {
            if ($membership->banned) {
                return ProjectInvitationResponse::BANNED;
            }
            return ProjectInvitationResponse::ALREADY_JOINED_PROJECT;
        }

        // check if project is private and if person uses an invitation
        if ($this->is_private && $invitationCode === '') {
            // Use invitation to join project
            if (!$this->getInvitedByCode($invitationCode, $this->id)) {
                return ProjectInvitationResponse::INVALID_INVITATION;
            }
            return ProjectInvitationResponse::REQUIRE_INVITATION;
        }

        return ProjectInvitationResponse::WELCOME;
    }

    public function getInvitedByCode(string $invitationCode, string $projectId): bool
    {
        // TODO implement invitation creation later
        // TODO decrement invitations when doing so
        return true;
    }

    public function generateInvitation(string $duration, ?int $uses, User $user)
    {

    }

    /**
     * Returns the user's role.
     */
    public function userRole(User $user)
    {
        $member = $this->members->find($user->id);
        if (!$member) return ProjectRole::VIEWER;
        return $member->pivot->role;
    }

}
