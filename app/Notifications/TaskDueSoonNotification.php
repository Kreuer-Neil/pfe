<?php

namespace App\Notifications;

use App\Models\Task;
use App\Notifications\Concerns\BroadcastsResourceShape;
use Illuminate\Notifications\Notification;

class TaskDueSoonNotification extends Notification
{
    use BroadcastsResourceShape;

    public function __construct(protected Task $task) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(?object $notifiable = null): array
    {
        return [
            'task_id' => $this->task->id,
            'task_title' => $this->task->title,
            'project_id' => $this->task->project_id,
            'project_slug' => $this->task->project->slug,
            'due_at' => $this->task->due_at,
        ];
    }
}
