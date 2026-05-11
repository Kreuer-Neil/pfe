<?php

namespace App\FormatedModels\Project;

use App\FormatedModels\FormatedProfile;
use App\FormatedModels\FormatedTask;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Str;

class FormatedProjectMiniature extends FormatedProjectContext
{

    public string $id;
    public string $name;
    public string $icon;
    public string $description;

//    public User $owner;
//    public array $related_members;
//    public string $user_role;


    public ?string $coordinates;
    public ?string $place;

    public bool $is_member;
    public string $slug;
    public int $members_count;

    public function __construct(Project $project, User $user)
    {
        $this->id = $project->id;
        $this->name = $project->name;
        $this->icon = $project->icon;
        $this->description = Str::limit(value: $project->description, preserveWords: true);

        $this->coordinates = $project->coordinates;
        $this->place = $project->place();
        $this->is_member = $project->members->find($user->id) !== null;
        $this->slug = $project->slug;

        $this->members_count = $project->members->count();
    }
}
