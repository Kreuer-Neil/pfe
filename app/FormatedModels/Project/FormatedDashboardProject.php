<?php

namespace App\FormatedModels\Project;

use App\Models\Project;

class FormatedDashboardProject extends FormatedProjectContext
{

    public string $id;
//    public User $owner;
    public string $name;
    public string $icon;
    public string $description;
    public int $members_count;

    public function __construct(Project $project)
    {
        $this->id = $project->id;
        $this->name = $project->name;
        $this->icon = $project->icon;
        $this->description = $project->description;
        $this->members_count = $project->members->count();
        // TODO add notifications etc. later? On another version
    }
}
