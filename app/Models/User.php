<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
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

        'nickname',
        'show_name',
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
            ->belongsToMany(Task::class, Participation::class);
    }

    /**
     * Get the user's projects
     */
    public function projects():BelongsToMany
    {
        return $this->belongsToMany(Project::class, Member::class);
    }

    /**
     * Ensures that if user has no nickname, returns the user's name
     */
    public function nickname():string
    {
        return $this->nickname ?? "$this->first_name $this->last_name";
    }

    /**
     * Get a user's upcoming tasks.
     */
    public function upcomingTasks(): BelongsToMany
    {
        return $this
            ->tasks()
            ->where('due_at', '>=', Carbon::now())
            ->orderBy('due_at', 'desc');
    }
}
