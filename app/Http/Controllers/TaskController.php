<?php

namespace App\Http\Controllers;

use App\FormatedModels\FormatedTask;
use App\Models\Task;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        // AGENDA
        return Inertia::render('tasks/tasks-index');
    }

    public function show()
    {
        if (!array_key_exists('task_id', $_REQUEST)) {
            return redirect(route('tasks'));
        }
        $currentUser = auth()->user();

        $task = Task::find($_REQUEST['task_id']);
        if (!$task || !$task->canSee($currentUser)) return 'Task not found';

//        dd(new FormatedTask($task, $currentUser->id));
        return [
            'task' => new FormatedTask($task, $currentUser->id)
        ];
    }
}
