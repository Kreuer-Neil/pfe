<?php

namespace App\Models;

use App\Enums\ProjectInvitationResponse;
use App\Enums\ProjectRole;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;
use Str;

class Project extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = ['owner_id', 'name', 'icon', 'description', 'language_id', 'location_id', 'is_private'];

    /**
     * Every project route/redirect uses the slug, not the id - route model binding
     * ({project:slug} or a bare {project}) and route()/redirect() calls that pass a Project
     * instance both resolve through this.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

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

            ProjectPermission::create([
                'project_id' => $project->id,
            ]);
        });
    }

    public function permissions(): HasOne
    {
        return $this->hasOne(ProjectPermission::class);
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
     * Returns member users, regardless of role - including banned ones. Needed for role/ban
     * lookups (userRole(), the ban/role-change policies) to work correctly; use activeMembers()
     * or bannedMembers() when displaying a member list that should split the two.
     */
    public function members(): BelongsToMany
    {
        return $this
            ->belongsToMany(User::class, Member::class)
            ->withPivot('role');
    }

    /**
     * Members with a non-banned role, for display purposes.
     */
    public function activeMembers(): BelongsToMany
    {
        return $this->members()->wherePivot('role', '!=', ProjectRole::BANNED->value);
    }

    /**
     * Members currently banned from the project, for display purposes.
     */
    public function bannedMembers(): BelongsToMany
    {
        return $this->members()->wherePivot('role', ProjectRole::BANNED->value);
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

    public function news(): HasMany
    {
        return $this
            ->hasMany(ProjectNews::class)
            ->orderBy('created_at', 'desc');
    }

    public function polls(): HasMany
    {
        return $this
            ->hasMany(ProjectPoll::class)
            ->orderBy('created_at', 'desc');
    }

    /**
     * Users explicitly following this project's news without being a member. Membership
     * itself already implies following for feed purposes - see followAs()/followedBy().
     */
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, ProjectFollow::class);
    }

    public function followedBy(User $user): bool
    {
        return ProjectFollow::where('user_id', $user->id)->where('project_id', $this->id)->exists();
    }

    /**
     * Mirrors User::followAs()'s shape (the target model owns the action, the follower is the
     * argument). Guards against a redundant row since membership already implies following.
     */
    public function followAs(User $user): bool
    {
        if ($this->userIsMember($user) || $this->followedBy($user)) {
            return false;
        }

        ProjectFollow::create([
            'user_id' => $user->id,
            'project_id' => $this->id,
        ]);

        return true;
    }

    public function unfollowAs(User $user): bool
    {
        $follow = ProjectFollow::where('user_id', $user->id)->where('project_id', $this->id)->first();

        if (! $follow) {
            return false;
        }

        $follow->delete();

        return true;
    }

    public function userIsMember(User $user): bool
    {
        return ! in_array($this->userRole($user), [ProjectRole::VIEWER->value, ProjectRole::BANNED->value]);
    }

    public function joinAsMember(User $user): ProjectInvitationResponse
    {
        // Check if user is already member
        if (! ($membership = $this->memberships->where('user_id', '==', $user->id))->isEmpty()) {
            if ($membership->first()->role === ProjectRole::BANNED->value) {
                return ProjectInvitationResponse::BANNED;
            }

            return ProjectInvitationResponse::ALREADY_JOINED_PROJECT;
        }

        // ProjectController handles invitations on private projects via itself.
        if ($this->is_private) {
            return ProjectInvitationResponse::INVALID_INVITATION;
        }

        Member::create([
            'user_id' => $user->id,
            'project_id' => $this->id,
            'role' => ProjectRole::MEMBER,
        ]);

        return ProjectInvitationResponse::WELCOME;
    }

    public function generateInvitation(?string $expires_at, ?int $max_uses): ProjectInvitation
    {
        $code = $this->generateInvitationCode();

        return ProjectInvitation::create([
            'project_id' => $this->id,
            'code' => $code,
            'expires_at' => $expires_at,
            'max_uses' => $max_uses,
        ]);
    }

    public function generateInvitationCode(): string
    {
        $code = Str::random();
        if (ProjectInvitation::where('code', $code)->exists()) {
            return $this->generateInvitationCode();
        }

        return $code;
    }

    /**
     * Returns the user's role.
     */
    public function userRole(User $user): string
    {
        $member = $this->members->find($user->id);
        if (! $member) {
            return ProjectRole::VIEWER->value;
        }

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

    /**
     * Suggests public projects the user hasn't joined, ranked by a simple additive score:
     * shared tags + matching spoken language + closer distance (capped at 50km), computed in PHP
     * (rather than raw SQL) to stay portable between the mysql and sqlite test suite.
     */
    public static function suggestedFor(User $user, int $limit = 6): Collection
    {
        $preferences = $user->preferences;
        $tagIds = $preferences?->tags->pluck('id') ?? collect();
        $languageIds = $preferences?->languages->pluck('id') ?? collect();
        $userLocation = $preferences?->location;

        $query = self::where('is_private', false)
            ->whereNotIn('projects.id', $user->projects()->pluck('projects.id'))
            ->with('tags')
            ->orderByDesc('projects.created_at')
            ->limit(200);

        if ($userLocation) {
            $query->withDistanceFrom($userLocation->latitude, $userLocation->longitude);
        }

        return $query->get()
            ->map(function (Project $project) use ($tagIds, $languageIds) {
                $sharedTags = $project->tags->pluck('id')->intersect($tagIds)->count();
                $languageMatch = $languageIds->contains($project->language_id);
                $distanceScore = $project->distance !== null
                    ? max(0, 5 - min($project->distance, 50) / 10)
                    : 0;

                $project->suggestion_score = $sharedTags * 2 + ($languageMatch ? 3 : 0) + $distanceScore;

                return $project;
            })
            ->sortByDesc('suggestion_score')
            ->take($limit)
            ->values();
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
