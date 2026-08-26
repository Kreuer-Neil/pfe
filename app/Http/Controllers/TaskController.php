<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;
use Gate;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        // AGENDA
        return Inertia::render('tasks/tasks-index');
    }

    public function show(Task $task)
    {
        // Hides "forbidden" behind "not found" so a private project's task IDs
        // aren't distinguishable from ones that don't exist, same convention as
        // ProjectController::show().
        if (!Gate::allows('view', $task->project)) {
            abort(404, __('validation.task_not_found'));
        }

        return response()->json([
            'task' => (new TaskResource($task))->toArray(request()),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_slug' => 'required|string|exists:projects,slug',
            'title' => 'required|string|min:3|max:255',
            'description' => 'required|string|min:3|max:65535',
            'due_date' => 'required|date_format:Y-m-d|after_or_equal:today',
            'due_time' => 'required|date_format:H:i',
            'min_participations' => 'nullable|integer|min:0',
        ] /*['project_slug.exists' => 'validation.project_undefined']*/);

        $project = Project::where('slug', $request['project_slug'])->firstOrFail();
        Gate::authorize('storeTask', $project);

        Task::create([
            'project_id' => $project->id,
            'user_id' => auth()->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'min_participations' => $validated['min_participations'] ?? null,
            'due_at' => $validated['due_date'] . ' ' . $validated['due_time'],
        ]);

        return redirect()->back();
    }

    public function participate($id)
    {
        $task = Task::find($id);
        if (!$task) {
            return redirect()->back()->withErrors(['participation' => __('validation.task_not_found')]);
        }

        Gate::authorize('joinTask', $task);

        if (!$task->participate(auth()->user())) {
            return redirect()->back()->withErrors(['participation' => __('validation.internal_error')]);
        }
        return redirect()->back();
    }

    public function validate($id)
    {
        try {
            $task = Task::findOrFail($id);
        } catch (ModelNotFoundException) {
            return redirect()->back()->withErrors(['validate' => __('validation.task_not_found')]);
        }
        Gate::authorize('validate', $task);

        $task->validated_at = Carbon::now();
        if (!$task->save()) {
            return redirect()->back()->withErrors(['validate' => __('validation.internal_error')]);
        }
        return redirect()->back();
    }

    public function cancelParticipation(int $id)
    {
        $task = Task::find($id);
        if (!$task || !$task->cancelParticipation(auth()->user())) {
            return redirect()->back()->withErrors(['cancel_participation' => __('validation.task_participation_cancel_failed')]);
        }

        return redirect()->back();
    }

    // TODO refactor functions
    public function update(int $id, Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:3|max:255',
            'description' => 'required|string',
            'due_at_date' => 'required|date|after_or_equal:today',
            'due_at_time' => 'required|date_format:H:i:s',
            'min_participations' => 'nullable|integer|min:1',
        ]);

        $task = Task::find($id);
        if (!$task) {
            return redirect()->back()->withErrors(['update' => __('validation.task_not_found')]);
        }

        Gate::authorize('update', $task);

        $task->title = $validated['title'];
        $task->description = $validated['description'];
        $task->due_at = ($validated['due_at_date'] . ' ' . $validated['due_at_time']);
        $task->min_participations = $validated['min_participations'] ?? null;

        if (!$task->save()) {
            return redirect()->back()->withErrors(['update' => __('validation.internal_error')]);
        }

        return redirect()->back();
    }

    public function destroy(string $id)
    {
        $task = Task::findOrFail($id);

        Gate::authorize('delete', $task);

        $task->delete();

        return redirect()->back();
    }
}
