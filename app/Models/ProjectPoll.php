<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class ProjectPoll extends Model
{
    use HasFactory;

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
        if (! $choiceId) {
            // Distinct voters, not row count - a `multi` poll can have several rows per user.
            return $this->participations()->distinct('user_id')->count('user_id');
        }

        return $this->participations()->where('poll_choice_id', $choiceId)->count();
    }

    // Distinct voters who picked at least one real choice - skip-only participations don't count,
    // so multi-choice percentages are relative to people who actually voted, not everyone who visited the poll.
    public function totalVoters(): int
    {
        return $this->participations()->whereNotNull('poll_choice_id')->distinct('user_id')->count('user_id');
    }

    public function isExpired(): bool
    {
        return $this->end_date <= now();
    }

    public function hasParticipated(User $user): bool
    {
        return $this->participations()->where('user_id', $user->id)->exists();
    }

    public function userSkipped(User $user): bool
    {
        return $this->participations()->where('user_id', $user->id)->whereNull('poll_choice_id')->exists();
    }

    public function userChoiceIds(User $user): array
    {
        return $this->participations()->where('user_id', $user->id)->whereNotNull('poll_choice_id')->pluck('poll_choice_id')->all();
    }

    // Results are visible to anyone once the poll has closed, or earlier to whoever already
    // voted/skipped - mirrors social-media polls: engage first, or wait for the poll to end.
    public function canSeeResults(User $user): bool
    {
        return $this->isExpired() || $this->hasParticipated($user);
    }

    /**
     * Casts (or replaces) $user's vote in one transaction: any previous participation rows for
     * this user on this poll are dropped first, so re-voting, switching choices, or moving to/from
     * a skip is always a clean replace rather than an insert racing the old rows.
     * An empty $choiceIds means "skip" - stored as a single row with poll_choice_id = null.
     */
    public function vote(User $user, array $choiceIds): void
    {
        DB::transaction(function () use ($user, $choiceIds) {
            $this->participations()->where('user_id', $user->id)->delete();

            if (empty($choiceIds)) {
                $this->participations()->create([
                    'user_id' => $user->id,
                    'poll_choice_id' => null,
                ]);

                return;
            }

            foreach ($choiceIds as $choiceId) {
                $this->participations()->create([
                    'user_id' => $user->id,
                    'poll_choice_id' => $choiceId,
                ]);
            }
        });
    }
}
