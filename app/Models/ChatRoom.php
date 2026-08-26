<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatRoom extends Model
{
    protected $fillable = ['name', 'type', 'project_id'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }

    /**
     * Returns the date string of a user's last visit to the chat room, or null if they never visited.
     */
    public function lastVisitedAt(User $user): ?string
    {
        return ChatLastVisit::where('user_id', $user->id)
            ->where('chat_room_id', $this->id)
            ->first()?->updated_at;
    }

    /**
     * Records that the user just visited this chat room, for unread tracking.
     */
    public function markVisited(User $user): void
    {
        ChatLastVisit::updateOrCreate([
            'user_id' => $user->id,
            'chat_room_id' => $this->id,
        ]);
    }

    public function hasUnreadMessages(User $user): bool
    {
        $lastVisitedAt = $this->lastVisitedAt($user);

        if (! $lastVisitedAt) {
            return $this->messages()->exists();
        }

        return $this->messages()->where('created_at', '>', $lastVisitedAt)->exists();
    }
}
