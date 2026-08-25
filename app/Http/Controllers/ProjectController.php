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
use App\Notifications\ProjectMemberBannedNotification;
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

    public function show(Project $project)
    {
        if (!Gate::allows('view', $project)) {
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


    public function updateAppearance(Project $project, Request $request)
    {
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

        return redirect(route('projects.edit', $project));
    }

    public function myProjects(Request $request)
    {
        $projects = [];
        foreach (auth()->user()->projects as $project) {
            $projects[] = (new ProjectDashboardResource($project))->toArray($request);
        }
        return Inertia::render('projects/my-projects', compact(['projects']));
    }

    public function join(Project $project)
    {
        if ($project->is_private) {
            return redirect(route('projects'));
        }

        $project->joinAsMember(auth()->user());

        return redirect(route('projects.show', $project));
    }

    public function follow(Project $project)
    {
        Gate::authorize('view', $project);

        $project->followAs(auth()->user());

        return redirect(route('projects.show', $project->slug));
    }

    public function unfollow(Project $project)
    {
        Gate::authorize('view', $project);

        $project->unfollowAs(auth()->user());

        return redirect(route('projects.show', $project->slug));
    }

    /**
     * Shared prop-building for the projects/settings/* pages.
     */
    private function settingsProps(Request $request, Project $project): array
    {
        $tagsList = Tag::all()->pluck('name');

        $actingUser = auth()->user();
        $memberManagement = $project->members->mapWithKeys(function (User $member) use ($project, $actingUser) {
            $manageable = Gate::forUser($actingUser)->allows('banMember', [$project, $member]);
            $assignableRoles = $manageable
                ? collect(ProjectRole::cases())
                    ->filter(fn(ProjectRole $role) => $role->value !== $member->pivot->role
                        && Gate::forUser($actingUser)->allows('updateMemberRole', [$project, $member, $role]))
                    ->map(fn(ProjectRole $role) => $role->value)
                    ->values()
                    ->all()
                : [];

            return [$member->id => ['manageable' => $manageable, 'assignable_roles' => $assignableRoles]];
        });

        $project = (new ProjectSettingsResource($project))->toArray($request);
        $members = collect($project['members'])
            ->map(fn(array $member) => array_merge(
                $member,
                $memberManagement->get($member['id'], ['manageable' => false, 'assignable_roles' => []])
            ));
        $project['members'] = $members->reject(fn(array $member) => $member['role'] === ProjectRole::BANNED->value)->values()->all();
        $project['banned_members'] = $members->filter(fn(array $member) => $member['role'] === ProjectRole::BANNED->value)->values()->all();

        return compact(['project', 'tagsList']);
    }

    public function editGeneral(Request $request, Project $project)
    {
        return Inertia::render('projects/settings/general', $this->settingsProps($request, $project));
    }

    public function editMembers(Request $request, Project $project)
    {
        return Inertia::render('projects/settings/members', $this->settingsProps($request, $project));
    }

    public function editPermissions(Request $request, Project $project)
    {
        return Inertia::render('projects/settings/permissions', $this->settingsProps($request, $project));
    }

    public function updatePermissions(Project $project, Request $request)
    {
        $project->permissions()->updateOrCreate([], [
            'allow_members_invitations' => $request->has('allow_members_invitations'),
        ]);

        return redirect(route('projects.edit.permissions', $project));
    }


    public function updateVisibility(Project $project, Request $request)
    {
        // TODO check if at least 1 tag before getting public
        $isPrivate = $request->has('is_private');

        if (!$isPrivate && !$project->location_id) {
            return redirect()->back()->withErrors(['is_private' => __('validation.location_required_for_public')]);
        }

        $project->is_private = $isPrivate;
        $project->save();

        return redirect(route('projects.edit', $project));
    }

    public function updateTags(Project $project, Request $request)
    {
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

        return redirect(route('projects.edit', $project));
    }

    public function updateMemberRole(Project $project, Request $request)
    {
        // BANNED is deliberately excluded here - banning is its own action/endpoint (banMember).
        $assignableRoles = collect(ProjectRole::cases())
            ->reject(fn($r) => $r === ProjectRole::BANNED)
            ->map(fn($r) => $r->value)
            ->all();

        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'role' => ['required', 'string', Rule::in($assignableRoles)],
        ]);

        $target = User::findOrFail($validated['user_id']);
        $role = ProjectRole::from($validated['role']);

        Gate::authorize('updateMemberRole', [$project, $target, $role]);

        $membership = $project->memberships()->where('user_id', $target->id)->firstOrFail();
        $membership->role = $role->value;
        $membership->save();

        return redirect()->back();
    }

    public function banMember(Project $project, Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $target = User::findOrFail($validated['user_id']);

        Gate::authorize('banMember', [$project, $target]);

        $membership = $project->memberships()->where('user_id', $target->id)->firstOrFail();
        $membership->role = ProjectRole::BANNED->value;
        $membership->save();

        $target->notify(new ProjectMemberBannedNotification($project));

        return redirect()->back();
    }

    public function updateLocation(Project $project, Request $request)
    {
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

        return redirect(route('projects.edit', $project));
    }
}
