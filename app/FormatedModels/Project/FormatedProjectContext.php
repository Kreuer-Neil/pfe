<?php

namespace App\FormatedModels\Project;

use App\Models\Project;

class FormatedProjectContext
{
    public string $id;
    public string $name;
    public string $icon;
    public string $slug;

    public function __construct(Project $project)
    {
        $this->id = $project->id;
        $this->name = $project->name;
        $this->icon = $project->icon;
        $this->slug = $project->slug;
    }
}
