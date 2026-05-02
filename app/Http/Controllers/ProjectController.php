<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{

    public function index()
    {
        $projects = Project::all();
        return Inertia::render('projects/index', ['projects' => $projects]);
    }

    public function show(Project $project)
    {
        $route = route('projects.show', $project->id);

        if ((!$project->userBelongsTo(auth()->user()))) {

            if ($project->is_private) {
            }

        }
        return Inertia::render('projects/show', ['project'=> $project, 'route' => $route]);
    }
}
