<?php

namespace App\Policies;

use App\Models\ChatRoom;
use App\Models\User;

class ChatRoomPolicy
{
    public function view(User $user, ChatRoom $chatRoom): bool
    {
        return $chatRoom->project->userIsMember($user);
    }

    public function sendMessage(User $user, ChatRoom $chatRoom): bool
    {
        return $chatRoom->project->userIsMember($user);
    }
}
