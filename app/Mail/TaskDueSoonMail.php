<?php

namespace App\Mail;

use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TaskDueSoonMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Task $task,
        public User $user,
    ) {}

    public function build(): self
    {
        return $this
            ->locale($this->user->locale() ?? config('app.fallback_locale'))
            ->to($this->user->email)
            ->subject(__('emails.task_due_soon_subject'))
            ->view('emails.task-due-soon', [
                'task' => $this->task,
                'project' => $this->task->project,
                'user' => $this->user,
            ]);
    }
}
