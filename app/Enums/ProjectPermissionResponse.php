<?php

namespace App\Enums;

enum ProjectPermissionResponse
{
    case NOT_MEMBER;

    case UNAUTHORIZED;

    case AUTHORIZED;
}
