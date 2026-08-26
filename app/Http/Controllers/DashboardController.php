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

        $suggestedProjects = ProjectMiniatureResource::collection(Project::suggestedFor($currentUser))->toArray(request());

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
            ->map(fn (ProjectNews $news) => [
                'type' => 'news',
                'created_at' => $news->created_at,
                'data' => (new ProjectNewsFeedResource($news))->toArray(request()),
            ]);

        // Dashboard-feed polls are "pending action" items only - unlike news, a poll drops out
        // once the user has voted or skipped it (or once it's closed, since there's nothing left
        // to do). It still stays visible on the project's own page regardless of this filter.
        $pollItems = ProjectPoll::whereIn('project_id', $currentUser->feedProjectIds())
            ->where('end_date', '>', now())
            ->whereDoesntHave('participations', fn ($query) => $query->where('user_id', $currentUser->id))
            ->with(['project', 'choices', 'user'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (ProjectPoll $poll) => [
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
