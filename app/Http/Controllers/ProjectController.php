<?php

namespace App\Http\Controllers;

use App\Enums\ProjectRole;
use App\Enums\ProjectsFilters;
use App\Http\Resources\Project\ProjectDashboardResource;
use App\Http\Resources\Project\ProjectMiniatureResource;
use App\Http\Resources\Project\ProjectResource;
use App\Http\Resources\TagRessourceCollection;
use App\Jobs\HandleProfileImageUploads;
use App\Models\Member;
use App\Models\Project;
use App\Models\ProjectTag;
use App\Models\Tag;
use App\Models\User;
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
        $query = $request->input('query') ?? null;
        $tags = $request->input('tags') ?? null;

        $order = $request->input('filter') ?? ProjectsFilters::RECENT_PROJECTS->value;
        $direction = $request->input('direction') === 'asc' ? 'asc' : 'desc';

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

        // TODO add filtering for data
        return ProjectMiniatureResource::collection(
            $queriedProjects->orderBy($order, $direction)
                ->get()
        )->toArray(request());
    }

    public function show(string $slug)
    {
        $project = Project::where('slug', $slug)->first();

        if (!$project || !Gate::allows('view', $project)) {
            abort(404, __('project_not_found'));
        }
        if ($project->userRole() )
        $project = (new ProjectResource($project))->toArray(request());
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
//            'is_private' => 'boolean',
            'tags' => 'required_if:is_private,true|array|max:7',
            'tags.*' => 'string|exists:tags,name',
        ]);
        // , ['name.unique' => 'project_name_exists']

        $ownerId = auth()->user()->id;
        $validated['owner_id'] = $ownerId;
        $validated['is_private'] = $request->has('is_private');
        $validated['slug'] = Str::slug($validated['name']);
        $tags = $validated['tags'];

        $project = Project::create($validated);

        foreach ($tags as $tagName) {
            $tag = Tag::where('name', $tagName)->first();
            ProjectTag::create([
                'tag_id' => $tag->id,
                'project_id' => $project->id,
            ]);
        }

        Member::create([
            'project_id' => $project->id,
            'user_id' => $ownerId,
            'role' => ProjectRole::ADMIN->value,
        ]);

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


        Member::create([
            'user_id' => auth()->user()->id,
            'project_id' => $project->id,
            'role' => ProjectRole::MEMBER
        ]);

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

        $project->is_private = $request->has('is_private');
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

    public function updateLocation(string $slug, Request $request)
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        if (!Gate::check('update', $project)) {
            abort(403);
        }

        $validated = $request->validate([
            'place' => 'nullable|string|max:255',
            'coordinates' => 'nullable|string|max:255',
        ]);

//        $project->place = $validated['place'];
        $project->coordinates = $validated['coordinates'];
        $project->save();

        Inertia::flash(['success' => true]);
        return redirect(route('projects.edit', $slug));
    }
}
