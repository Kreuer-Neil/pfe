<?php

namespace App\FormatedModels;

use App\Models\Project;
use App\Models\User;

class FormatedProjectContext
{
    public string $id;
//    public User $owner;
    public string $name;
    public string $icon;
//    public string $description;

    public function __construct(Project $project)
    {
        $this->id = $project->id;
        $this->name = $project->name;
        $this->icon = $project->icon;
    }
}
