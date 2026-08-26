<?php

namespace App\Notifications;

use App\Enums\NotificationType;
use App\Mail\ProjectMemberBannedMail;
use App\Models\Project;
use App\Notifications\Concerns\BroadcastsResourceShape;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class ProjectMemberBannedNotification extends Notification
{
    use BroadcastsResourceShape;

    public function __construct(protected Project $project) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['database', 'broadcast'];

        if ($notifiable->wantsEmailFor(NotificationType::PROJECT_MEMBER_BANNED)) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toMail(object $notifiable): Mailable
    {
        return new ProjectMemberBannedMail($this->project, $notifiable);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(?object $notifiable = null): array
    {
        return [
            'project_id' => $this->project->id,
            'project_slug' => $this->project->slug,
            'project_name' => $this->project->name,
        ];
    }
}
