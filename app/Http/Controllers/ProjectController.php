<?php

namespace App\Http\Controllers;

use App\Enums\BaseTags;
use App\Enums\ProjectRole;
use App\Enums\ProjectsFilters;
use App\Http\Resources\Project\ProjectMiniatureResource;
use App\Http\Resources\Project\ProjectResource;
use App\Jobs\HandleProfileImageUploads;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Str;

class ProjectController extends Controller
{

    public function index(Request $request)
    {
        // use Pagination
        $filtersList = ProjectsFilters::cases();
        // TODO create
        $tagsList = BaseTags::cases();

        $currentFilter = $request['filters'] ?? (Str::lower(ProjectsFilters::RECENT_PROJECTS->name));

        $currentTags = $request['tags'] ?? [];

        $projects = $this->searchProjects($request);

        auth()->user()->projects;
        return Inertia::render('projects/index',
            compact(['filtersList', 'tagsList', 'currentFilter', 'currentTags', 'projects'])
        );
    }

    public function searchProjects(
        Request $request
    )
    {
        $query = $request['query'] ?? null;

        $order = $request['filter'] ?? ProjectsFilters::RECENT_PROJECTS->value;
        $direction = (array_key_exists('direction', $_REQUEST) && $_REQUEST['direction'] === 'asc')
            ? 'asc' : 'desc';

        $queriedProjects = Project::where('is_private', false);

        if ($query) {
            // TODO use advanced queries to not cancel is_private clause
            $queriedProjects = $queriedProjects
                ->whereLike('name', '%' . $query . '%')
                ->orWhere('is_private', false)
                ->whereLike('description', '%' . $query . '%');
        }

        // TODO add filtering for data
        return ProjectMiniatureResource::collection(
            $queriedProjects->orderBy($order, $direction)
            ->get()
        )->toArray(request());
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

        return (new ProjectResource($project))->toArray(request());
    }

    public function create()
    {
        auth()->user()->projects;
        return Inertia::render('projects/projects-create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:6|max:255|unique:projects,name',
            'description' => 'required|min:6|string',
            'is_private' => 'boolean',
        ]);
        // , ['name.unique' => 'project_name_exists']

        $ownerId = auth()->user()->id;
        $validated['owner_id'] = $ownerId;
        $validated['is_private'] = array_key_exists('is_private', $validated);
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
            'icon' => 'nullable|image|extensions:jpg,jpeg,png,gif,webp|max:2048|dimensions:max_width=2000,max_height=2000'
        ]);

        if (array_key_exists('icon', $validated)) {

            $oldIconName = $project->icon;

            $path = $request
                ->file('icon')
                ->store('images/projects', 'public');

            $iconName = Str::beforeLast(Str::afterLast($path, '/'), '.');

            HandleProfileImageUploads::dispatch($iconName, $oldIconName, $path, 'projects');

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
