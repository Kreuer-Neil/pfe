<?php

namespace App\FormatedModels;

use App\Models\User;

class FormatedUser
{
    public int $id;
    public string $first_name;
    public string $last_name;

    public string $nickname;
    public ?string $avatar;
    public ?string $bio;


    public function __construct(User $user)
    {
        $this->id = $user->id;
        $this->first_name = $user->first_name;
        $this->last_name = $user->last_name;
        $this->nickname = $user->nickname();
        $this->avatar = $user->avatar;
        $this->bio = $user->bio;
    }
}
