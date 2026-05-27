<?php

namespace App\FormatedModels;

use App\Models\User;

class FormatedProfile
{
    public int $id;
    public ?string $first_name;
    public ?string $last_name;
    public string $nickname;
    public ?string $image;
    public ?string $bio;

    public function __construct(
        User $user
    )
    {
        $this->id = $user->id;
        $this->nickname = $user->nickname();
        if ($user->show_name) {
            $this->first_name = $user->first_name;
            $this->last_name = $user->last_name;
        }
        $this->image = $user->image;
        $this->bio = $user->bio;
    }
}
