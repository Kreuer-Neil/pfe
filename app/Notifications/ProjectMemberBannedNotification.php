<?php

namespace App\Notifications;

use App\Models\Project;
use App\Notifications\Concerns\BroadcastsResourceShape;
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
        return ['database', 'broadcast'];
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
