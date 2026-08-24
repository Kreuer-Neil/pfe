<?php

namespace App\Mail;

use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ProjectMemberBannedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Project $project,
        public User $user,
    ) {}

    public function build(): self
    {
        return $this
            ->locale($this->user->locale() ?? config('app.fallback_locale'))
            ->to($this->user->email)
            ->subject(__('emails.project_member_banned_subject'))
            ->view('emails.project-member-banned', [
                'project' => $this->project,
                'user' => $this->user,
            ]);
    }
}
