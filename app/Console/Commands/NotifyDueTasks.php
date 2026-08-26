<?php

namespace App\Console\Commands;

use App\Models\Task;
use App\Notifications\TaskDueSoonNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class NotifyDueTasks extends Command
{
    protected $signature = 'notifications:due-tasks';

    protected $description = 'Notify participating users about tasks due within the next 24 hours';

    public function handle(): void
    {
        $tasks = Task::query()
            ->whereNull('validated_at')
            ->whereNotNull('due_at')
            ->where('due_at', '>=', Carbon::now())
            ->where('due_at', '<=', Carbon::now()->addDay())
            ->get();

        foreach ($tasks as $task) {
            foreach ($task->participatingUsers as $user) {
                $alreadyNotified = $user->notifications()
                    ->where('type', TaskDueSoonNotification::class)
                    ->where('data->task_id', $task->id)
                    ->exists();

                if (! $alreadyNotified) {
                    $user->notify(new TaskDueSoonNotification($task));
                }
            }
        }
    }
}
