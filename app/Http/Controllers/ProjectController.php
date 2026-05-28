<?php

namespace App\Http\Controllers;

use App\Enums\BaseTags;
use App\Enums\ProjectsFilters;
use App\FormatedModels\Project\FormatedProject;
use App\FormatedModels\Project\FormatedProjectMiniature;
use App\Models\Project;
use App\Models\User;
use Inertia\Inertia;

class ProjectController extends Controller
{

    public function index()
    {

        $filters = null;
        // TODO create
        $tags = BaseTags::cases();

        // TODO fix this for nav
//        auth()->user()->toFormatedNavUser();
        auth()->user()->projects;
        return Inertia::render('projects/index', compact(['filters', 'tags']));
    }

    public function indexPersonnal()
    {
        $filters = [ProjectsFilters::MyProjects, ProjectsFilters::RecentProjects];
        $queryFilters = ['filter' => ProjectsFilters::MyProjects];

        $tags = BaseTags::cases();
        $title = 'my_projects';

        return Inertia::render('projects/index', compact(['filters', 'queryFilters', 'tags', 'title']));
    }

    public function indexSearch()
    {
        // TODO find a better way to do this
        if (!(array_key_exists('user_request', $_REQUEST) && $_REQUEST['user_request'] === '1')) {
            return redirect(route('projects'));
        }
        $order = ProjectsFilters::RecentProjects->value;
        $direction = (array_key_exists('direction', $_REQUEST) && $_REQUEST['direction'] === 'asc')
            ? 'asc' : 'desc';

        $queriedProjects = Project::where('is_private', false);

        if (array_key_exists('query', $_REQUEST)) {
            $query = $_REQUEST['query'];
            // TODO use advanced queries to not cancel is_private clause
            $queriedProjects = $queriedProjects
                ->whereLike('name', '%' . $query . '%')
                ->orWhere('is_private', false)
                ->whereLike('description', '%' . $query . '%');
        }

        // TODO add filtering for data
        $queriedProjects = $queriedProjects
            ->orderBy($order, $direction)
            ->get();

        $projects = [];
        foreach ($queriedProjects as $project) {
            $projects[] = new FormatedProjectMiniature($project, auth()->user());
        }


        return [
            'links' => [
                [
                    'url' => route('projects') . '/1',
                    'label' => 'label',
                    'active' => false
                ]
            ],
            'data' => $projects
        ];
    }

    public function show(string $slug)
    {
        $project = Project::where('slug', $slug)->first();
        $user = auth()->user();
        if (!$project || !($project = $this->getShowDataFor($user, $project))) {
            abort(404);
        }

        auth()->user()->projects;
        return Inertia::render(
            'projects/show',
            compact('project'));
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
