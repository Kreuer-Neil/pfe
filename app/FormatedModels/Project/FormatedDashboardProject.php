<?php

namespace App\FormatedModels\Project;

use App\Models\Project;
use Illuminate\Support\Str;

class FormatedDashboardProject extends FormatedProjectContext
{

    public string $id;
//    public User $owner;
    public string $name;
    public string $icon;
    public string $description;

    public ?string $coordinates;
    public ?string $place;
    public string $slug;
    public int $members_count;

    public function __construct(Project $project)
    {
        $this->id = $project->id;
        $this->name = $project->name;
        $this->icon = $project->icon;
        $this->description = Str::limit(value: $project->description, preserveWords: true);


        $this->coordinates = $project->coordinates;
        $this->place = $project->place();
        $this->slug = $project->slug;
        $this->members_count = $project->members->count();
        // TODO add notifications etc. later? On another version
    }
}
