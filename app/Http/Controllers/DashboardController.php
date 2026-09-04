<?php

namespace App\Http\Controllers;

use App\Http\Resources\Project\ProjectDashboardResource;
use App\Http\Resources\Project\ProjectMiniatureResource;
use App\Http\Resources\ProjectNewsFeedResource;
use App\Http\Resources\ProjectPollFeedResource;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\ProjectNews;
use App\Models\ProjectPoll;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $currentUser = auth()->user();

        $userLocation = $currentUser->preferences?->location;
        $projectsQuery = $currentUser->projects();

        if ($userLocation) {
            $projectsQuery = $projectsQuery->withDistanceFrom($userLocation->latitude, $userLocation->longitude);
        }

        $projects = ProjectDashboardResource::collection($projectsQuery->get())->toArray(request());

        // TODO add message "Set preferences if you want project suggestions" instead of the projects feed? With link to it.
        $suggestedProjects = $currentUser->preferences->hasProjectPreferences()
            ? ProjectMiniatureResource::collection(Project::suggestedFor($currentUser))->toArray(request())
            : [];

        $tasks = TaskResource::collection(
            $currentUser
                ->upcomingTasks
//                    ->with(['owner', 'project', 'participations'])
//                ->take(10)
//                    ->get()
            ,
        )->toArray(request());

        $now = str(now()->toDateTimeString())->beforeLast(':');

        $newsItems = ProjectNews::whereIn('project_id', $currentUser->feedProjectIds())
            ->with(['project', 'author'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn(ProjectNews $news) => [
                'type' => 'news',
                'created_at' => $news->created_at,
                'data' => (new ProjectNewsFeedResource($news))->toArray(request()),
            ]);

        // Dashboard-feed polls are "pending action" items only,
        $pollItems = ProjectPoll::whereIn('project_id', $currentUser->feedProjectIds())
            ->where('end_date', '>', now())
            ->whereDoesntHave('participations', fn($query) => $query->where('user_id', $currentUser->id))
            ->with(['project', 'choices', 'user'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn(ProjectPoll $poll) => [
                'type' => 'poll',
                'created_at' => $poll->created_at,
                'data' => (new ProjectPollFeedResource($poll))->toArray(request()),
            ]);

        $feedItems = $newsItems->concat($pollItems)
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->toArray();

        $dashboardFeedHidden = $currentUser->preferences?->dashboard_feed_hidden ?? false;

        return Inertia::render(
            'dashboard',
            compact('projects', 'suggestedProjects', 'tasks', 'now', 'feedItems', 'dashboardFeedHidden')
        );
    }
}
