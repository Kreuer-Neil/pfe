<?php

namespace App\Policies;

use App\Enums\ProjectRole;
use App\Models\ChatMessage;
use App\Models\User;

class ChatMessagePolicy
{
    public function update(User $user, ChatMessage $chatMessage): bool
    {
        return $chatMessage->user_id === $user->id;
    }

    public function delete(User $user, ChatMessage $chatMessage): bool
    {
        if ($chatMessage->user_id === $user->id) {
            return true;
        }

        $role = $chatMessage->chatRoom->project->userRole($user);

        return in_array($role, [ProjectRole::MODERATOR->value, ProjectRole::ADMIN->value]);
    }
}
