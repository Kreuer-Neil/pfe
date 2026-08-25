<?php

namespace App\Enums;

/// Remember to edit React types when editing these
enum ProjectRole: string
{
    // Can do pretty much everything except delete project
    case ADMIN = 'admin';

    // Can't do admin actions like change status(?) or delete a room, or edit some settings, but can create tasks and manage members
    case MODERATOR = 'moderator';

    // Can't touch the settings but can add tasks
    case TASK_MANAGER = 'task_manager';

    // Can only do basic interactions
    case MEMBER = 'member';

    // Banned user
    case BANNED = 'banned';
    const VIEWER = 'viewer';

    /**
     * Authority rank used to decide who can change/ban whom (higher manages lower).
     * The project owner bypasses this entirely - see ProjectPolicy::canManageMember().
     */
    public function rank(): int
    {
        return match ($this) {
            self::ADMIN => 3,
            self::MODERATOR => 2,
            self::TASK_MANAGER, self::MEMBER => 1,
            self::BANNED => 0,
        };
    }
}
