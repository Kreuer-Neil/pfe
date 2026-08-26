<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PollParticipation extends Model
{
    protected $fillable = [
        'project_poll_id',
        'poll_choice_id',
        'user_id',
    ];

    public function poll(): BelongsTo
    {
        return $this->belongsTo(ProjectPoll::class, 'project_poll_id');
    }

    public function choice(): BelongsTo
    {
        return $this->belongsTo(PollChoice::class, 'poll_choice_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}