<?php

namespace App\Http\Controllers;

use App\FormatedModels\FormatedTaskMiniature;
use App\FormatedModels\Project\FormatedDashboardProject;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $currentUser = auth()->user();

        $userProjects = [];
        foreach ($currentUser->projects as $project) {
            $userProjects[] = new FormatedDashboardProject($project);
        }

        $tasks = [];
        // TODO do the same with users & profiles
        foreach ($currentUser->upcomingTasks->take(6) as $upcomingTask) {
            $formatedUpcomingTask = new FormatedTaskMiniature($upcomingTask, $currentUser->id);
            $tasks[] = $formatedUpcomingTask;
        }

//        syncLangFiles(['main-nav', 'dashboard', 'project', 'date', 'pagination']);
        return Inertia::render(
            'dashboard',
            compact('userProjects', 'tasks')
        );
    }
}
