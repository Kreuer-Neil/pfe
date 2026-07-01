<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskNote;
use Gate;
use Illuminate\Http\Request;

class TaskNoteController extends Controller
{
    public function store(int $taskId, Request $request)
    {
        $task = Task::findOrFail($taskId);
        Gate::authorize('createNote', $task);

        $validated = $request->validate([
            'content' => 'required|string|min:1|max:65535',
        ]);

        TaskNote::create([
            'task_id' => $taskId,
            'user_id' => auth()->user()->id,
            'content' => $validated['content'],
        ]);

        return redirect()->back();
    }

    public function update(int $noteId, Request $request)
    {
        $note = TaskNote::findOrFail($noteId);
        Gate::authorize('update', $note);

        $validated = $request->validate([
            'content' => 'required|string|min:1|max:65535',
        ]);

        $note->content = $validated['content'];
        $note->save();

        return redirect()->back();
    }

    public function destroy(int $noteId)
    {
        $note = TaskNote::findOrFail($noteId);
        Gate::authorize('delete', $note);

        $note->delete();

        return redirect()->back();
    }
}
