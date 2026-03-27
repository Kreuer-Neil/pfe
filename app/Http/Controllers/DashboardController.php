<?php

namespace App\Http\Controllers;

use App\FormatedModels\FormatedTask;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $currentUser = auth()->user();

        $userProjects = $currentUser->projects;

        $tasks = [];
        // TODO turn into generic function (model method) to do that
        foreach ($currentUser->upcomingTasks as $upcomingTask) {
            $formatedUpcomingTask = new FormatedTask(
                id: $upcomingTask->id,
                owner: $upcomingTask->owner()->first(),
                title: $upcomingTask->title,
                description: $upcomingTask->description,
                project_id: $upcomingTask->project_id,
                min_participations: $upcomingTask->min_participations,
                participating_users: $upcomingTask->participatingUsers()
                    ->select(['id', 'nickname', 'image', 'bio',]),
                // if self is participating
                is_self_participating: $upcomingTask->isParticipating($currentUser),
                starting_at: $upcomingTask->starting_at,
                due_at: $upcomingTask->due_at,
                created_at: $upcomingTask->created_at,
                updated_at: $upcomingTask->updated_at,
            );
            $tasks[] = $formatedUpcomingTask;
        }

        syncLangFiles(['nav', 'dashboard', 'project', 'misc']);
        return Inertia::render(
            'dashboard',
            compact('userProjects', 'tasks')
        );
    }
}
