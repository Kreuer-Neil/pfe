<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PollChoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_poll_id',
        'label',
        'position',
    ];

    public function poll(): BelongsTo
    {
        return $this->belongsTo(ProjectPoll::class, 'project_poll_id');
    }

    public function participations(): HasMany
    {
        return $this->hasMany(PollParticipation::class);
    }
}
