<?php

namespace App\Notifications;

use App\Enums\NotificationType;
use App\Mail\TaskDueSoonMail;
use App\Models\Task;
use App\Notifications\Concerns\BroadcastsResourceShape;
use Illuminate\Mail\Mailable;
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
        $channels = ['database', 'broadcast'];

        if ($notifiable->wantsEmailFor(NotificationType::TASK_DUE_SOON)) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toMail(object $notifiable): Mailable
    {
        return new TaskDueSoonMail($this->task, $notifiable);
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
