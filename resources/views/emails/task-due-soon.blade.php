<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #222; line-height: 1.5;">
    <p>{{ __('emails.task_due_soon_greeting', ['name' => $user->first_name]) }}</p>
    <p>{{ __('emails.task_due_soon_line', ['title' => $task->title, 'project' => $project->name]) }}</p>
    <p>
        <a href="{{ route('projects.show', $project->slug) }}">{{ __('emails.task_due_soon_action') }}</a>
    </p>
</body>
</html>