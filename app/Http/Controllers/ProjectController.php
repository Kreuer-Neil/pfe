<?php

namespace App\Http\Controllers;

use App\Enums\ProjectRole;
use App\Enums\ProjectsFilters;
use App\Http\Resources\Project\ProjectDashboardResource;
use App\Http\Resources\Project\ProjectMiniatureResource;
use App\Http\Resources\Project\ProjectResource;
use App\Http\Resources\Project\ProjectShowresource;
use App\Http\Resources\TagRessourceCollection;
use App\Jobs\HandleProfileImageUploads;
use App\Models\Project;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Validation\Rule;
use Gate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Str;

class ProjectController extends Controller
{

    public function index(Request $request)
    {
        // use Pagination
        $filtersList = ProjectsFilters::cases();

        $tagsList = (new TagRessourceCollection(Tag::all()))->toArray($request);
        $currentFilter = $request->input('filters') ?? (Str::lower(ProjectsFilters::RECENT_PROJECTS->name));
        $currentTags = $request->input('tags') ?? [];
        $projects = $this->searchProjects($request);

        return Inertia::render('projects/index',
            compact(['filtersList', 'tagsList', 'currentFilter', 'currentTags', 'projects'])
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
            // TODO use advanced queries to not cancel is_private clause
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
            if ($order === ProjectsFilters::CLOSE_PROJECTS->value) {
                $queriedProjects = $queriedProjects->withDistanceFrom($userLocation->latitude, $userLocation->longitude);
                $orderColumn = 'distance';
            }
            if ($maxDistance) {
                $queriedProjects = $queriedProjects->where('distance', '<=', $maxDistance);
            }
        }

        return ProjectMiniatureResource::collection(
            $queriedProjects->orderBy($orderColumn, $direction)
                ->get()
        )->toArray(request());
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
        $tagsList = (new TagRessourceCollection(Tag::all()))->toArray($request);

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
            'tags' => 'required_if:is_private,true|array|max:7',
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

        Inertia::flash(['success' => true]);
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
            Inertia::flash(['error' => [
                'key' => 'project_not_found',
                'params' => [],
            ]]);
            return redirect(route('projects.show', $slug));
        }

        if ($project->is_private) {
            return redirect(route('projects'));
        }


        $project->joinAsMember(auth()->user());

        Inertia::flash(['join_success' => true]);
        return redirect(route('projects.show', $slug));
    }

    public function edit(Request $request, string $slug)
    {
        $project = Project::where('slug', $slug)->firstOrFail();
        $tagsList = (new TagRessourceCollection(Tag::all()))->toArray($request);
        $project = (new ProjectResource($project))->toArray($request);

        return Inertia::render('projects/edit', compact(['project', 'tagsList']));
    }


    public function updateVisibility(string $slug, Request $request)
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        Gate::authorize('update', $project);

        $isPrivate = $request->has('is_private');

        if (!$isPrivate && !$project->location_id) {
            return redirect()->back()->withErrors(['is_private' => __('validation.location_required_for_public')]);
        }

        $project->is_private = $isPrivate;
        $project->save();

        Inertia::flash(['success' => true]);
        return redirect(route('projects.edit', $slug));
    }

    public function updateTags(string $slug, Request $request)
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        if (!Gate::check('update', $project)) {
            abort(403);
        }

        $validated = $request->validate([
            'tags' => 'required|array|max:7',
            'tags.*' => 'string|exists:tags,name',
        ]);

        $tagIds = [];
        foreach ($validated['tags'] as $tagName) {
            $tag = Tag::where('name', $tagName)->first();
            $tagIds[] = $tag->id;
        }

        $project->tags()->sync($tagIds);

        Inertia::flash(['success' => true]);
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

        Inertia::flash(['role_change_success' => true]);
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

        Inertia::flash(['success' => true]);
        return redirect(route('projects.edit', $slug));
    }
}
