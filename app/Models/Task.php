<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Prompts\Note;
use function PHPUnit\Framework\isInt;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'project_id',
        'starting_at',
        'due_at',
        'min_participations'
    ];
    use SoftDeletes;

    /**
     * Returns the task's project.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Returns the task owner.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Returns the task's notes.
     */
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    /**
     * Returns the task's participations
     */
    public function participations(): HasMany
    {
        return $this->hasMany(Participation::class, 'task_id');
    }

    /**
     * Returns a list of participating users.
     */
    public function participatingUsers(int $currentUserId): BelongsToMany
    {
        // TODO order by contacts with currentUser
        return $this->belongsToMany(User::class, Participation::class);
    }

    /**
     * Tries to make a user join a task.
     * If user is already participating or if it doesn't belong to the project, returns false.
     * Returns true after adding the participation otherwise.
     */
    public function participate(User $user): bool
    {
        if (Participation::where('user_id', $user->id)->where('task_id', $this->id)->exists()) {
            return false;
        }
        try {
            Participation::create([
                'user_id' => $user->id,
                'task_id' => $this->id,
            ]);
        } catch (Exception) {
            return false;
        }
        return true;
    }

    public function isParticipating(User|int $user): bool
    {
        $userId = isInt($user) ? $user : $user->id;
        return !$this->participations->where('user_id', '==', $userId)->isEmpty();
    }
}
