<?php

namespace App\Http\Controllers;

use App\FormatedModels\FormatedTask;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Validation\ValidationException;
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
        if (!$task || !$task->canSee($currentUser)) return ['Task not found'];
//        dd(new FormatedTask($task, $currentUser->id));
        return [
            'task' => new FormatedTask($task, $currentUser->id)
        ];
    }

    public function store()
    {
        if (!(
            array_key_exists('project_id', $_REQUEST) &&
            array_key_exists('title', $_REQUEST) &&
            array_key_exists('description', $_REQUEST) &&
            array_key_exists('due_at', $_REQUEST))
        ) {
            return [
                'success' => false,
                'error' => [
                    'key' => 'missing_parameters',
                    'params' => [
                    ],
                ]
            ];
        }
        $project = Project::find($_REQUEST['project_id']);
        $currentUser = auth()->user();

        // TODO add last PHP-side verification before sending

        try {
            $validated = request()->validate([
                'project_id' => 'required|string|exists:projects,id',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'due_at' => 'required|date',
                'min_participations' => 'nullable|integer|min:0',
            ]);
        } catch (ValidationException) {
            return [
                'success' => false,
                'error' => [
                    'key' => 'invalid_parameters',
                    'params' => [
                    ],
                ]
            ];
        }

        if ($project->addTask(new Task($validated), $currentUser) === null) {
            return [
                'success' => false,
                'error' => [
                    'key' => 'not_allowed_on_project',
                    'params' => []
                ],
            ];
        };

        return [
            'success' => true,
            'error' => [
                'key'=>'success_task_created',
                'params'=>[
                    'task'=> $validated['title']
                ]
            ]
        ];

    }

    public function participate()
    {

    }
}
