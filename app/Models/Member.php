<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
//    use SoftDeletes;

    protected $fillable = ['user_id', 'project_id', 'role_id',
        'role'
    ];

    /**
     * Returns the user corresponding to this project member.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Returns the membership's project
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

//    /**
//     * Returns this member's tasks.
//     */
//    public function tasks(): BelongsToMany
//    {
//        return $this
//            ->belongsToMany(Task::class, Participation::class);
//    }
//
//    /**
//     * Returns this member's upcoming tasks.
//     */
//    public function upcomingTasks(): BelongsToMany
//    {
//        return $this
//            ->tasks()
//            ->where('due_at', '>=', Carbon::now());
//    }
}
