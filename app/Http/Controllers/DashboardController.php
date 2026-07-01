<?php

namespace App\Http\Controllers;

use App\Http\Resources\Project\ProjectDashboardResource;
use App\Http\Resources\TaskResource;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $currentUser = auth()->user();

        $projects = [];
        foreach ($currentUser->projects as $project) {
            $projects[] = (new ProjectDashboardResource($project))->toArray(request());
        }

        // TODO do the same with users & profiles
        $tasks = TaskResource::collection(
            $currentUser
                ->upcomingTasks
//                    ->with(['owner', 'project', 'participations'])
//                ->take(10)
//                    ->get()
            ,
        )->toArray(request());

        $now = str(now()->toDateTimeString())->beforeLast(':');
        return Inertia::render(
            'dashboard',
            compact('projects', 'tasks', 'now')
        );
    }
}
