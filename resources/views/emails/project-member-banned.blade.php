<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #222; line-height: 1.5;">
    <p>{{ __('emails.project_member_banned_greeting', ['name' => $user->first_name]) }}</p>
    <p>{{ __('emails.project_member_banned_line', ['project' => $project->name]) }}</p>
</body>
</html>