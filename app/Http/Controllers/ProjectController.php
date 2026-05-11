<?php

namespace App\Http\Controllers;

use App\Enums\BaseTags;
use App\Enums\ProjectsFilters;
use App\FormatedModels\Project\FormatedProject;
use App\FormatedModels\Project\FormatedProjectMiniature;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PHPUnit\Logging\OpenTestReporting\Status;
use function Pest\Laravel\json;

class ProjectController extends Controller
{

    public function index()
    {
        $filters = null;
        // TODO create
        $tags = BaseTags::cases();

//        syncLangFiles(['main-nav', 'projects', 'projects-index', 'date', 'pagination']);
        return Inertia::render('projects/index', compact(['filters', 'tags']));
    }

    public function indexPersonnal()
    {
        $filters = [ProjectsFilters::MyProjects,ProjectsFilters::RecentProjects];
        $queryFilters = ['filter' => ProjectsFilters::MyProjects];

        $tags = BaseTags::cases();
        $title = 'my_projects';

        return Inertia::render('projects/index', compact(['filters', 'queryFilters', 'tags', 'title']));
    }

    public function indexSearch()
    {
        // TODO find a better way to do this
        if (!(array_key_exists('user_request',$_REQUEST) && $_REQUEST['user_request'] === '1')) {
            return redirect(route('projects'));
        }
        $order = 'coordinates';
        $direction = (array_key_exists('direction', $_REQUEST)) ? ($_REQUEST['direction'] === 'desc' ? 'desc' : 'asc') : 'desc';

        $queriedProjects = Project::where('is_private', false);

        if (array_key_exists('query', $_REQUEST)) {
            $query = $_REQUEST['query'];
            $queriedProjects = $queriedProjects
                ->whereLike('name', '%'.$query.'%')
                ->orWhereLike('description', '%'.$query.'%');
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
        $project = Project::where('slug',$slug)->first();
        $route = route('projects.show', $project->slug);

        $user = auth()->user();
        $project = $this->getShowDataFor($user, $project);

        if (!$project) {
            abort(404);
        }

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
