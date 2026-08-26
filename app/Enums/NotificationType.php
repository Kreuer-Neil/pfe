<?php

namespace App\Enums;

/// Remember to edit React types when editing these
enum NotificationType: string
{
    case TASK_DUE_SOON = 'task_due_soon';
    case PROJECT_MEMBER_BANNED = 'project_member_banned';
}
