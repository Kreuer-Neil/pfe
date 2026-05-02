<?php

namespace App\Http\Controllers;

use App\FormatedModels\Project\FormatedProject;
use App\Models\Project;
use App\Models\User;
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

        $project = $this->getShowDataFor(auth()->user(), $project);

        syncLangFiles(['main-nav', 'project', 'date', 'pagination']);
        return Inertia::render(
            'projects/show',
            compact('project', 'route'));
    }


    /**
     * Gets the required show data for the project view (should not be here)
     */
    private function getShowDataFor(User $user, Project $project)
    {
        if (!$project->userIsMember(auth()->user())) {

            if ($project->is_private) {
                return null;
            }

        }
        // Get user role too

        return new FormatedProject($project, $user);
    }
}
