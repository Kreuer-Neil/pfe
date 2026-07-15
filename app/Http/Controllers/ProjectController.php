<?php

namespace App\Http\Controllers;

use App\Enums\ProjectRole;
use App\Enums\ProjectsFilters;
use App\Http\Resources\Project\ProjectDashboardResource;
use App\Http\Resources\Project\ProjectMiniatureResource;
use App\Http\Resources\Project\ProjectResource;
use App\Http\Resources\Project\ProjectSettingsResource;
use App\Http\Resources\Project\ProjectShowresource;
use App\Jobs\HandleProfileImageUploads;
use App\Models\Project;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Validation\Rule;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\RequiredIf;
use Inertia\Inertia;
use Str;

class ProjectController extends Controller
{

    public function index(Request $request)
    {
        $hasLocation = (bool)auth()->user()->preferences?->location;

        // Remove proximity filters for users with no location
        $filtersList = collect(ProjectsFilters::cases())
            ->filter(fn(ProjectsFilters $filter) => $hasLocation || $filter !== ProjectsFilters::CLOSE_PROJECTS)
            ->values();

        $tagsList = Tag::all()->pluck('name');

        $distancesList = [5, 10, 15, 20, 30, 50];

        $currentFilter = $request->input('filter')
            ?? ($hasLocation ? ProjectsFilters::CLOSE_PROJECTS->value : ProjectsFilters::RECENT_PROJECTS->value);
        $currentTags = $request->input('tags') ?? [];

        $paginatedProjects = $this->searchProjects($request);
        $projects = ProjectMiniatureResource::collection($paginatedProjects)->toArray($request);
        $projectsNextPage = $paginatedProjects->currentPage() < $paginatedProjects->lastPage()
            ? $paginatedProjects->currentPage() + 1
            : null;

        return Inertia::render('projects/index',
            compact(['filtersList', 'tagsList', 'distancesList', 'currentFilter', 'currentTags', 'hasLocation', 'projects', 'projectsNextPage'])
        );
    }

    private function searchProjects(
        Request $request
    )
    {
        $request->validate([
            'query' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|exists:tags,name',
            'max_distance' => 'nullable|int'
        ]);
        $query = $request->input('query') ?? null;
        $tags = $request->input('tags') ?? null;
        $maxDistance = $request->input('max_distance') ?? null;

        $userLocation = auth()->user()->preferences?->location;

        $order = $request->input('filter') ?? ($userLocation ? ProjectsFilters::CLOSE_PROJECTS->value : ProjectsFilters::RECENT_PROJECTS->value);
        // Closest-first makes more sense as the default for proximity than newest-first's default of desc.
        $direction = in_array($request->input('direction'), ['asc', 'desc'])
            ? $request->input('direction')
            : ($order === ProjectsFilters::CLOSE_PROJECTS->value ? 'asc' : 'desc');

        $queriedProjects = Project::where('is_private', false)->with(['tags']);

        if ($query) {
            $queriedProjects = $queriedProjects->where(function ($q) use ($query) {
                $q->whereLike('name', '%' . $query . '%')
                    ->orWhereLike('description', '%' . $query . '%');
            });
        }

        if ($tags) {
            $queriedProjects = $queriedProjects->whereHas('tags', fn($q) => $q->whereIn('name', $tags));
        }

        $orderColumn = $order;

        if ($userLocation) {
            $queriedProjects = $queriedProjects->withDistanceFrom($userLocation->latitude, $userLocation->longitude);

            if ($order === ProjectsFilters::CLOSE_PROJECTS->value) {
                $orderColumn = 'distance';
            }
            if ($maxDistance) {
                // Using having instead of where because distance is a "scope" column
                $queriedProjects = $queriedProjects->having('distance', '<=', $maxDistance);
            }
        }

        return $queriedProjects->orderBy($orderColumn, $direction)->paginate(20);
    }

    public function show(string $slug)
    {
        $project = Project::where('slug', $slug)->first();

        if (!$project || !Gate::allows('view', $project)) {
            abort(404, __('project_not_found'));
        }
        if ($project->userRole(auth()->user()) === ProjectRole::VIEWER) {
            $project = (new ProjectShowResource($project))->toArray(request());
        } else {
            $project = (new ProjectResource($project))->toArray(request());
        }
        $now = str(now()->toDateTimeString())->beforeLast(':');
        return Inertia::render(
            'projects/projects-show',
            compact('project', 'now'));
    }

    public function create(Request $request)
    {
        $tagsList = Tag::all()->pluck('name');

        return Inertia::render(
            'projects/projects-create',
            compact(['tagsList'])
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:6|max:255|unique:projects,name',
            'description' => 'required|min:6|string',
//            'is_private' => 'nullable|contains:1',
            // Public projects need tags for discoverability
            'tags' => 'required_unless:is_private,1|array|max:7',
            'tags.*' => 'string|exists:tags,name',
            'q' => 'required_unless:is_private,1|string|max:255',
            'osm_id' => 'required_unless:is_private,1|string|max:255',
            'osm_type' => 'required_unless:is_private,1|string|max:255',
        ]);
        // , ['name.unique' => 'project_name_exists']

        $validated['owner_id'] = auth()->user()->id;
        $validated['is_private'] = $request->has('is_private');
        $tagNames = array_key_exists('tags', $validated) ? $validated['tags'] : [];

        if (!empty($validated['osm_id'])) {
            $location = LocationController::resolveFromSearchCache($validated['q'], $validated['osm_id'], $validated['osm_type']);

            if (!$location) {
                return redirect()->back()->withErrors(['osm_id' => __('validation.location_selection_expired')]);
            }

            $validated['location_id'] = $location->id;
        }

        $project = Project::create($validated);

        $project->tags()->sync(Tag::whereIn('name', $tagNames)->pluck('id'));

        return redirect(route('projects.show', $project->slug));
    }


    public function updateAppearance(string $slug, Request $request)
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        if (!Gate::check('updateAppearance', $project)) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|image|extensions:jpg,jpeg,png,gif,webp|max:2048|dimensions:max_width=2000,max_height=2000',
        ]);

        if ($request->hasFile('icon')) {
            $oldIconName = $project->icon;
            $path = $request->file('icon')->store('images/projects', 'public');
            $iconName = Str::beforeLast(Str::afterLast($path, '/'), '.');
            HandleProfileImageUploads::dispatch($iconName, $oldIconName, $path, 'projects');
            $project->icon = $iconName;
        }

        $project->name = $validated['name'];
        $project->description = $validated['description'];
        $project->save();

        return redirect(route('projects.edit', $slug));
    }

    public function myProjects(Request $request)
    {
        $projects = [];
        foreach (auth()->user()->projects as $project) {
            $projects[] = (new ProjectDashboardResource($project))->toArray($request);
        }
        return Inertia::render('projects/my-projects', compact(['projects']));
    }

    public function join(string $slug)
    {
        $project = Project::where('slug', $slug)->first();
        if (!$project) {
            return redirect()->back()->withErrors(['join' => __('validation.project_not_found')]);
        }

        if ($project->is_private) {
            return redirect(route('projects'));
        }


        $project->joinAsMember(auth()->user());

        return redirect(route('projects.show', $slug));
    }

    public function edit(Request $request, string $slug)
    {
        $project = Project::where('slug', $slug)->firstOrFail();
        $tagsList = Tag::all()->pluck('name');
        $project = (new ProjectSettingsResource($project))->toArray($request);

        return Inertia::render('projects/edit', compact(['project', 'tagsList']));
    }


    public function updateVisibility(string $slug, Request $request)
    {
        // TODO check if at least 1 tag before getting public
        $project = Project::where('slug', $slug)->firstOrFail();

        Gate::authorize('update', $project);

        $isPrivate = $request->has('is_private');

        if (!$isPrivate && !$project->location_id) {
            return redirect()->back()->withErrors(['is_private' => __('validation.location_required_for_public')]);
        }

        $project->is_private = $isPrivate;
        $project->save();

        return redirect(route('projects.edit', $slug));
    }

    public function updateTags(string $slug, Request $request)
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        if (!Gate::check('update', $project)) {
            abort(403);
        }

        $validated = $request->validate([
            'tags' => [Rule::requiredIf(!$project->is_private), 'array', 'max:7'],
            'tags.*' => 'string|exists:tags,name',
        ]);

        $tagIds = [];
        foreach ($validated['tags'] as $tagName) {
            $tag = Tag::where('name', $tagName)->first();
            $tagIds[] = $tag->id;
        }

        $project->tags()->sync($tagIds);

        return redirect(route('projects.edit', $slug));
    }

    public function updateMemberRole(string $slug, Request $request)
    {
        $project = Project::where('slug', $slug)->firstOrFail();
        Gate::authorize('updateMemberRole', $project);

        $assignableRoles = collect(ProjectRole::cases())
            ->reject(fn($r) => $r === ProjectRole::VIEWER)
            ->map(fn($r) => $r->value)
            ->all();

        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'role' => ['required', 'string', Rule::in($assignableRoles)],
        ]);

        $target = User::findOrFail($validated['user_id']);
        $role = ProjectRole::from($validated['role']);

        if (!$project->updateMemberRole($target, $role)) {
            return redirect()->back()->withErrors(['role' => __('validation.member_not_found')]);
        }

        return redirect()->back();
    }

    public function updateLocation(string $slug, Request $request)
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        if (!Gate::check('update', $project)) {
            abort(403);
        }

        $validated = $request->validate([
            'q' => [Rule::requiredIf(!$project->is_private), 'required_with:osm_id,osm_type', 'string', 'max:255'],
            'osm_id' => [Rule::requiredIf(!$project->is_private), 'required_with:q', 'string', 'max:255'],
            'osm_type' => [Rule::requiredIf(!$project->is_private), 'required_with:q', 'string', 'max:255'],
        ]);

        $oldLocation = $project->location;

        if (!empty($validated['osm_id'])) {
            $location = LocationController::resolveFromSearchCache($validated['q'], $validated['osm_id'], $validated['osm_type']);

            if (!$location) {
                return redirect()->back()->withErrors(['osm_id' => __('validation.location_selection_expired')]);
            }

            $project->location_id = $location->id;
        } else {
            $project->location_id = null;
        }

        $project->save();

        // Check since it's nullable
        if ($oldLocation) {
            // remove old location
            $oldLocation->removeIfUnused();
        }

        return redirect(route('projects.edit', $slug));
    }
}
