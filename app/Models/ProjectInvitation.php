<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectInvitation extends Model
{
    protected $fillable = [
        'project_id',
        'code',
        'expires_at',
        'max_uses',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'max_uses' => 'integer',
        'used_count' => 'integer',
    ];

    public function project():BelongsTo
    {
        return $this->BelongsTo(Project::class);
    }

    public function isValid():bool
    {
        return $this->exists
            && (!$this->expires_at || $this->expires_at->isFuture());
    }

    /**
     * Revokes the use validity of an invitation.
     */
    public function revoke(): bool
    {
        $this->expires_at = now();
        return $this->save();
    }

    /**
     * Records a successful join through this invitation, auto-revoking it once exhausted.
     */
    public function recordUse(): void
    {
        $this->increment('used_count');

        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) {
            $this->revoke();
        }
    }

    public function getRemainingUsesAttribute(): ?int
    {
        return $this->max_uses === null ? null : max($this->max_uses - $this->used_count, 0);
    }
}
