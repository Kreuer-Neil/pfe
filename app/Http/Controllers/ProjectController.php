<?php

namespace App\Http\Controllers;

use App\FormatedModels\Project\FormatedProject;
use App\FormatedModels\Project\FormatedProjectMiniature;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{

    public function index()
    {
        $order = 'coordinates';
        $direction = 'desc';
        $search = NULL;
        $queriedProjects = Project::where('is_private', false);
        if ($search) {
            $queriedProjects = $queriedProjects->whereLike('name', $search)->orWhereLike('description', $search);
        }

        // TODO add filtering for data
        $queriedProjects = $queriedProjects->orderBy($order, $direction)->get();

        $projects = [];
        foreach ($queriedProjects as $project) {
            $projects[] = new FormatedProjectMiniature($project, auth()->user());
        }

        syncLangFiles(['main-nav', 'projects', 'projects-index', 'date', 'pagination']);
        return Inertia::render('projects/index', compact('projects'));
    }

    public function show(Project $project)
    {
        $route = route('projects.show', $project->id);

        $project = $this->getShowDataFor(auth()->user(), $project);

        syncLangFiles(['main-nav', 'projects', 'date', 'pagination']);
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
