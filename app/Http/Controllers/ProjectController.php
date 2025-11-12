<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{

    public function table()
    {
        $projects = Project::all();
        return Inertia::render('projects/table', ['projects' => $projects]);
    }

    public function show(Project $project)
    {
        $route = route('projects.show', $project->id);
        return Inertia::render('projects/show', ['project'=> $project, 'route' => $route]);
    }
}
