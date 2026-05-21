<?php

namespace App\Http\Controllers;

use App\FormatedModels\FormatedTask;
use App\Models\Project;
use App\Models\Task;
use Inertia\Inertia;
use function Laravel\Prompts\error;

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

    public function store()
    {
        if (
            array_key_exists('project_id', $_REQUEST) &&
            array_key_exists('title', $_REQUEST) &&
            array_key_exists('description', $_REQUEST) &&
            array_key_exists('due_at', $_REQUEST)
        ) {
            $project = Project::find($_REQUEST['project_id']);
            $currentUser = auth()->user();

            // TODO add last PHP-side verification before sending

            if (false) {
                return [
                    'success' => false,
                    'error' => [
                        'key' => 'invalid_field',
                        'params' => [
                            'field' => 'returned_field'
                        ],
                    ]
                ];
            }
            $project->addTask(new Task(request()->all()), $currentUser);

            return [
                'success' => true,
                'error' => null
            ];
        }
    }
}
