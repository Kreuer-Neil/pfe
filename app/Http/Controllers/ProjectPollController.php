<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProjectPollController extends Controller
{
    // TODO add index (per project) for long-ended polls or to show polls if more than X on dashboard
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:3|max:150',
            'multi' => 'nullable|boolean',
            'end_date' => 'required|date|after:now',
            'choices' => 'required|array|min:2|max:10',
            'choices.*' => 'required|string|min:1|max:100',
        ]);

        DB::transaction(function () use ($validated, $project) {
            $poll = $project->polls()->create([
                'user_id' => auth()->user()->id,
                'title' => $validated['title'],
                'multi' => $validated['multi'] ?? false,
                'end_date' => $validated['end_date'],
            ]);

            foreach (array_values($validated['choices']) as $position => $label) {
                $poll->choices()->create([
                    'label' => $label,
                    'position' => $position,
                ]);
            }
        });

        return redirect()->back();
    }

    public function vote(Request $request, Project $project, int $poll)
    {
        $poll = $project->polls()->findOrFail($poll);

        if ($poll->isExpired()) {
            return back()->withErrors(['poll' => 'This poll has already closed.']);
        }

        $validated = $request->validate([
            'choice_ids' => 'present|array',
            'choice_ids.*' => ['integer', Rule::exists('poll_choices', 'id')->where('project_poll_id', $poll->id)],
        ]);

        if (! $poll->multi && count($validated['choice_ids']) > 1) {
            return back()->withErrors(['choice_ids' => 'This poll only allows a single choice.']);
        }

        $poll->vote(auth()->user(), $validated['choice_ids']);

        return redirect()->back();
    }

    public function destroy(Project $project, int $poll)
    {
        $poll = $project->polls()->findOrFail($poll);

        Gate::authorize('deletePoll', [$project, $poll]);

        $poll->delete();

        return redirect()->back();
    }
}
