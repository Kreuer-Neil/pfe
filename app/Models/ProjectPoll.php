<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectPoll extends Model
{
    protected $fillable = [
        'user_id',
        'project_id',
        'title',
        'multi',
        'end_date',
    ];

    protected $casts = [
        'multi' => 'boolean',
        'end_date' => 'datetime',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    // Poll creator
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function choices(): HasMany
    {
        return $this->hasMany(PollChoice::class)->orderBy('position');
    }

    public function participations(): HasMany
    {
        return $this->hasMany(PollParticipation::class);
    }

    public function participationsCount(?int $choiceId = null): int
    {
        if (!$choiceId) {
            // Distinct voters, not row count - a `multi` poll can have several rows per user.
            return $this->participations()->distinct('user_id')->count('user_id');
        }

        return $this->participations()->where('poll_choice_id', $choiceId)->count();
    }

    public function results()
    {
        // Only people who voted/skipped vote (empty participation) should be able to view results, as it is done in social medias to avoid being influenced by the majority. But that should be handled in a policy, later.
        return $this->end_date <= now()
            ? $this->getChoice()
            : '';
    }

    private function getChoice(): array
    {
        // Returns the choice(s) that was/were the most voted (several if ex-aequo), with the count and percentage.
        return [];
    }
}
