<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\FormatedModels\FormatedNavUser;
use App\FormatedModels\FormatedProfile;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'avatar',
        'nickname',
        'bio',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get a user's profile informations
     */
    public function profile(): User
    {
        return $this->select([
            'id',
            'nickname',
            'image',
            'bio',
        ]);
    }
    // TODO fix later

//    /**
//     * Get a user's list of projects.
//     */
//    public function projects(): BelongsToMany
//    {
//        return $this
//            ->belongsToMany(Project::class, Member::class)->withPivot('role');
//    }

    /**
     * Get the list of a user's tasks participation.
     */
    public function tasks(): BelongsToMany
    {
        return $this
            ->belongsToMany(Task::class, Participation::class)
            ->orderBy('due_at', 'asc');
    }

    /**
     * Get a user's upcoming tasks.
     */
    public function upcomingTasks(): BelongsToMany
    {
        return $this
            ->tasks()
            // TODO check for this later, only for non-validated tasks if possible
            // Add 24h-left tasks from user projects with not enough participations and mix them
            // ->where('due_at', '<=', Carbon::now()->addHours(-24))
            // ->where('pivot_participating',true)
            ;
    }

    /**
     * Get the user's projects
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, Member::class);
    }

    /**
     * Returns temporary formated user to make nav work
     */
    public function toFormatedNavUser(): FormatedNavUser
    {
        return new FormatedNavUser($this);
    }

    /**
     * Returns formated user profile
     */
    public function toFormatedProfile(): FormatedProfile
    {
        return new FormatedProfile($this);
    }

    public static function canFindUser($userId, User $currentUser): null|User
    {
        $user = User::find($userId);

        if (!$user) {
            return null;
        }

//        if ($user->is_private) {
            // Check if user has projects in common or public projects
//        }

        return $user;
    }
}
