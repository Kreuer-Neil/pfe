<?php

namespace App\FormatedModels;

use App\Models\User;

class FormatedProfile
{
    public int $id;
    public ?string $first_name;
    public ?string $last_name;
    public string $nickname;
    public ?string $pronouns;
    public ?string $avatar;
    public ?string $bio;
    public bool $is_following;

    public function __construct(
        User $user,
        User $currentUser,
    )
    {
        $this->id = $user->id;
        $this->first_name = $user->first_name;
        $this->last_name = $user->last_name;
        $this->nickname = $user->nickname;
        $this->pronouns = $user->pronouns;
        $this->avatar = $user->avatar;
        $this->bio = $user->bio;
        $this->is_following = $currentUser->follows()->where('followed_user_id', $user->id)->exists();
    }
}
