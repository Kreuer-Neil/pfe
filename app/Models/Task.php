<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'project_id', 'starting_at', 'due_at', 'min_participations'];
    use SoftDeletes;


    /**
     * Returns the task owner
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function participations(): HasMany
    {
        return $this->hasMany(Participation::class, 'task_id');
    }

    public function participatingUsers(): BelongsToMany
    {
        // TODO attach profiles to participatingUsers (to get profile infos for task participant)
        return $this->belongsToMany(User::class, Participation::class);
    }

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

    public function isParticipating(User $user): bool
    {
        return $this->where('user_id', $user->id)->exists();
    }
}
