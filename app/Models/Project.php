<?php

namespace App\Models;

use App\Enums\ProjectInvitationResponses;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory;
    use SoftDeletes;

    //TODO: Slug as project identifier
    protected $fillable = ['owner_id', 'name', 'icon', 'description', 'status', 'slug', 'lang', 'coordinates', 'is_private'];

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, Member::class)->withPivot(['role_id']);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function addTask(Task $task): Task
    {
        return Task::create([
            'user_id' => $task->user_id,
            'project_id' => $this->id,
            'title' => $task->title,
            'description' => $task->description,
            'min_participations' => $task->min_participations,
            'due_at' => $task->due_at,
            'starting_at' => $task->starting_at,
        ]);
    }

    public function joinAsMember(User $user, string $invitationCode = null)
    {
        // TODO use enum for "responses"
        // Check if user is already member
        if (Project::$members->where('user_id', '==', $user->id)->exists())
            return ProjectInvitationResponses::ALREADY_JOINED_PROJECT;

        // check if project is private and if person uses an invitation
        if ($this->is_private && $invitationCode === null) {
            // Use invitation to join project
            if (!$this->getInvitedByCode($invitationCode, $this->id)) {
                return ProjectInvitationResponses::INVALID_INVITATION;
            }
            return ProjectInvitationResponses::REQUIRE_INVITATION;
        }

        return ProjectInvitationResponses::WELCOME;
    }

    public function getInvitedByCode(string $invitationCode, string $projectId):bool
    {
        // TODO implement invitation creation later
        // TODO decrement invitations when doing so
        return true;
    }
}
