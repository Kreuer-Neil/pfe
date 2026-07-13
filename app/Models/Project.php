<?php

namespace App\Models;

use App\Enums\ProjectAction;
use App\Enums\ProjectInvitationResponse;
use App\Enums\ProjectPermissionResponse;
use App\Enums\ProjectRole;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;
use Str;

class Project extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = ['owner_id', 'name', 'icon', 'description', 'language_id', 'location_id', 'is_private'];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Project $project) {
            $project->slug = Str::slug($project->name);
        });

        static::created(function (Project $project) {
            Member::create([
                'project_id' => $project->id,
                'user_id' => $project->owner_id,
                'role' => ProjectRole::ADMIN,
            ]);

            ChatRoom::create([
                'project_id' => $project->id,
            ]);
        });
    }

    /**
     * Returns the address where the project takes place
     */
    public function place(): ?string
    {
        return $this->location?->display_name;
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Adds a `distance` column (in km, great-circle) from the given point, via the Haversine formula.
     * Left-joins locations so projects without one (shouldn't happen for public projects, but just in
     * case) don't get silently dropped from the results - they'll just have a null distance.
     */
    public function scopeWithDistanceFrom(Builder $query, float $latitude, float $longitude): Builder
    {
        return $query
            ->leftJoin('locations', 'locations.id', '=', 'projects.location_id')
            ->select('projects.*')
            ->selectRaw(
                '(6371 * acos(cos(radians(?)) * cos(radians(locations.latitude)) * cos(radians(locations.longitude) - radians(?)) + sin(radians(?)) * sin(radians(locations.latitude)))) as distance',
                [$latitude, $longitude, $latitude]
            );
    }

    /**
     * Returns member users
     */
    public function members(): BelongsToMany
    {
        return $this
            ->belongsToMany(User::class, Member::class)
            ->withPivot('role')
            ->where('banned', false);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
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
                    if (in_array($memberRole, [ProjectRole::TASK_MANAGER->value, ProjectRole::MODERATOR->value, ProjectRole::ADMIN->value,
                        // TODO remove later
//                        ProjectRole::MEMBER->value
                    ]))
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
        return !in_array($this->userRole($user), [ProjectRole::VIEWER, ProjectRole::BANNED]);
    }

    public function updateMemberRole(User $target, ProjectRole $newRole): bool
    {
        if ($newRole === ProjectRole::VIEWER) return false;

        $membership = $this->memberships()->where('user_id', $target->id)->first();
        if (!$membership) return false;

        $membership->role = $newRole->value;
        return $membership->save();
    }

    // TODO remove and use the policies
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

        Member::create([
            'user_id' => $user->id,
            'project_id' => $this->id,
            'role' => ProjectRole::MEMBER,
        ]);

        return ProjectInvitationResponse::WELCOME;
    }

    public function getInvitedByCode(string $invitationCode, string $projectId): bool
    {
        // TODO implement invitation creation later
        // TODO decrement invitations when doing so
        return true;
    }

    public function generateInvitation(string|null $expires_at, int|null $max_uses): ProjectInvitation
    {
        $code = $this->generateInvitationCode();
        return ProjectInvitation::create([
            'project_id' => $this->id,
            'code' => $code,
            'expires_at' => $expires_at,
            'max_uses' => $max_uses,
        ]);
    }

    function generateInvitationCode(): string
    {
        $code = Str::random();
        if (ProjectInvitation::where('code', $code)->exists())
            return $this->generateInvitationCode();
        return $code;
    }

    /**
     * Returns the user's role.
     */
    public function userRole(User $user): string
    {
        $member = $this->members->find($user->id);
        if (!$member) return ProjectRole::VIEWER;
        return $member->pivot->role;
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(ProjectInvitation::class);
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function lang(): BelongsTo
    {
        return $this->belongsTo(Language::class);
    }

    /*
     * Returns the project's chat rooms
     */
    public function chatRooms(): HasMany
    {
        return $this->hasMany(ChatRoom::class);
    }

    public function defaultChatRoom(): ?ChatRoom
    {
        return $this->chatRooms()->where('type', 'default')->first();
    }
}
