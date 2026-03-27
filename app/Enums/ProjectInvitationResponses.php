<?php

namespace App\Enums;

enum ProjectInvitationResponses
{
    case ALREADY_JOINED_PROJECT;
    case INVALID_INVITATION;
    case REQUIRE_INVITATION;
    case WELCOME;
}
