<?php

namespace App\Enums;

enum ProjectInvitationResponse
{
    case ALREADY_JOINED_PROJECT;
    case INVALID_INVITATION;
    case BANNED;
    case REQUIRE_INVITATION;
    case WELCOME;
}
