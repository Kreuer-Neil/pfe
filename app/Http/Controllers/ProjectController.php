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
use File;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Format;
use Intervention\Image\Image;
use Intervention\Image\ImageManager;
use Str;
use function Laravel\Prompts\error;
use function Pest\Laravel\delete;

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

    public function store(Request $request)
    {
        Inertia::flash([
            'name' => $request['name'],
            'description' => $request['description'],
            'is_private' => $request['is_private'],
        ]);

        $validated = $request->validate([
            'name' => 'required|string|min:6|max:255|unique:projects,name',
            'description' => 'required|min:6|string',
            'is_private' => 'required',
        ]);
        // , ['name.unique' => 'project_name_exists']

        $ownerId = auth()->user()->id;
        $validated['owner_id'] = $ownerId;
        $validated['is_private'] = $validated['is_private'] === 'on';
        $validated['slug'] = Str::slug($validated['name']);

        $project = Project::create($validated);

        Member::create([
            'project_id' => $project->id,
            'user_id' => $ownerId,
            'role' => ProjectRole::ADMIN->value,
        ]);

        return redirect(route('projects.show', $project->slug));
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

        if (array_key_exists('icon', $validated)) {

            $oldIconName = $project->icon;

            $path = $request
                ->file('icon')
                ->store('images/projects', 'public');

            $iconName = Str::beforeLast(Str::afterLast($path, '/'), '.');

            // TODO queued jobs
            $imageManager = ImageManager::usingDriver(Driver::class);
            $scales = ['small' => 32, 'medium' => 64, 'large' => 160];

            foreach ($scales as $key => $scale) {
                $image = $imageManager->decodePath('../storage/app/public/' . $path);
                $image->cover($scale, $scale);
                $encoded = $image->encodeUsingFormat(Format::PNG, quality: 65);
                $encoded->save("../storage/app/public/images/projects/${key}/${iconName}.png");
                if ($oldIconName) {
                    $oldFilePath = "../storage/app/public/images/projects/${key}/${oldIconName}.png";
                    if (File::exists($oldFilePath)) {
                        File::delete($oldFilePath);
                    }
                }
            }

            if (File::exists("../storage/app/public/images/projects/${iconName}.png")) {
                File::delete("../storage/app/public/images/projects/${iconName}.png");
            }

            $project->icon = $iconName;
        }

        if ($project->canEdit($currentUser)) {
            Inertia::flash(['error' => [
                'key' => 'not_allowed',
                'params' => []
            ]]);


        }

        $project->name = $validated['name'];
        $project->description = $validated['description'];

        if (!$project->save()) {
            // TODO remove flash and add error
        }

        Inertia::flash(['success' => true]);
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

    public function join(string $slug)
    {
        $project = Project::where('slug', $slug)->first();
        if (!$project) {
            Inertia::flash(['error' => [
                'key' => 'project_not_found',
                'params' => [],
            ]]);
            return redirect(route('projects.show', $slug));
        }

        if ($project->is_private) {
            return redirect(route('projects'));
        }


        Member::create([
            'user_id' => auth()->user()->id,
            'project_id' => $project->id,
            'role' => ProjectRole::MEMBER
        ]);

        Inertia::flash(['join_success' => true]);
        return redirect(route('projects.show', $slug));
    }
}
