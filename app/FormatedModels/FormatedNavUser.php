<?php

namespace App\FormatedModels;

use App\FormatedModels\Project\FormatedProjectContext;
use App\Models\User;

class FormatedNavUser extends FormatedUser
{
    public int $id;
    public string $first_name;
    public string $last_name;

    public string $nickname;
    public string|null $avatar;
    public array $projects;


    public function __construct(User $user)
    {
        parent::__construct($user);
        $this->id = $user->id;
        $this->first_name = $user->first_name;
        $this->last_name = $user->last_name;
        $this->nickname = $user->nickname();
        $this->avatar = $user->avatar;

        $this->projects = [];
        foreach ($user->projects as $project) {
            $this->projects[] = new FormatedProjectContext($project);
        }
//        $this->image = getImagePaths('userProfile', $user->image);

    }

}
