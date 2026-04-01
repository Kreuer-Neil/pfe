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
        // TODO do the same with users & profiles
        foreach ($currentUser->upcomingTasks->take(3) as $upcomingTask) {
            $formatedUpcomingTask = new FormatedTask($upcomingTask, $currentUser->id);
            $tasks[] = $formatedUpcomingTask;
        }

        syncLangFiles(['nav', 'dashboard', 'project', 'date', 'misc', 'user', 'pagination']);
        return Inertia::render(
            'dashboard',
            compact('userProjects', 'tasks')
        );
    }
}
