<?php

namespace App\Http\Controllers;

use App\Enums\BaseTags;
use App\Enums\ProjectRole;
use App\Enums\ProjectsFilters;
use App\FormatedModels\Project\FormatedDashboardProject;
use App\FormatedModels\Project\FormatedProject;
use App\FormatedModels\Project\FormatedProjectMiniature;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Format;
use Intervention\Image\Image;
use Intervention\Image\ImageManager;
use Str;

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
            'projects/projects-show',
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

    public function create()
    {
        auth()->user()->projects;
        return Inertia::render('projects/projects-create');
    }

    public function store()
    {
        if (!(
            array_key_exists('name', $_REQUEST) &&
            array_key_exists('description', $_REQUEST) &&
            array_key_exists('is_private', $_REQUEST)
        )) {
            return [
                'success' => false,
                'error' => [
                    'key' => 'missing_parameters',
                    'params' => [
                    ],
                ]
            ];
        }

        try {
            $validated = request()->validate([
                'name' => 'required|string|min:6|max:255|unique:projects',
                'description' => 'required|min:6|string',
                'is_private' => 'required|bool',
            ], ['name.unique' => 'project_name_exists']
            );
        } catch (ValidationException $exception) {
            // Status if project name already exists
            return in_array('project_name_exists', $exception->errors()['name']) ? [
                'success' => false,
                'error' => [
                    'key' => 'project_name_exists',
                    'params' => [
                        'name' => $_REQUEST['name'],
                    ],
                ]
            ] : [
                'success' => false,
                'error' => [
                    'key' => 'invalid_parameters',
                    'params' => [
                    ],
                ]
            ];
        }

        $ownerId = auth()->user()->id;
        $validated['owner_id'] = $ownerId;

        try {
            $project = Project::factory()->create($validated);
        } catch (Exception $exception) {
            return [
                'success' => false,
                'error' => [
                    'key' => 'not_allowed',
                    'params' => []
                ],
            ];
        }

        Member::create([
            'project_id' => $project->id,
            'user_id' => $ownerId,
            'role' => ProjectRole::ADMIN->value,
        ]);

        return ['success' => true,
            'error' => ['key' => 'success_project_edited',
                'params' => [
                    'project' => $validated['name']
                ]
            ]
        ];
    }

    public function updateAppearance(string $slug, Request $request)
    {
        /*if (!(
            $request->name &&
            $request->icon
        )) {
            Inertia::flash([
                'success' => false,
                'error' => [
                    'key' => 'missing_parameters',
                    'params' => [],
                ]
            ]);
        }*/

        $project = Project::where('slug', $slug)->first();
        if (!$project) {
            Inertia::flash(['error' => [
                'key' => 'project_not_found',
                'params' => [],
            ]]);
            return redirect(route('projects.show', $slug));
        }

        $currentUser = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|image'
        ]);

        $path = $request
            ->file('icon')
            ->store('images/projects', 'public');

        $iconName = Str::beforeLast(Str::afterLast($path, '/'), '.');

        // TODO queued jobs
        $imageManager = ImageManager::usingDriver(Driver::class);
        $scales = ['small' => 32, 'medium' => 64, 'large' => 160];

        foreach ($scales as $key => $scale) {
            $image = $imageManager->decodePath('../storage/app/public/'.$path);
            $image->scale($scale, $scale);
            $encoded = $image->encodeUsingFormat(Format::JPEG, quality: 65);
            $encoded->save("../storage/app/public/images/projects/${key}/${iconName}.jpg");
        }

        if ($project->canEdit($currentUser)) {
            Inertia::flash(['error' => [
                'key' => 'not_allowed',
                'params' => []
            ]]);
        }

        $project->name = $validated['name'];
        $project->description = $validated['description'];
        $project->icon = $iconName;

        if (!$project->save()) {
            Inertia::flash(['error' => [
                'key' => 'not_allowed',
                'params' => []
            ]]);
        }

        return redirect(route('projects.show', $slug));
    }

    public function myProjects()
    {
        $projects = [];
        foreach (auth()->user()->projects as $project) {
            $projects[] = new FormatedDashboardProject($project);
        }
        return Inertia::render('projects/my-projects', compact(['projects']));
    }
}
