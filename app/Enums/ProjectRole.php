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
}
