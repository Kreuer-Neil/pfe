<?php

namespace App\Providers;

use App\Models\ChatMessage;
use App\Models\ChatRoom;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskNote;
use App\Policies\ChatMessagePolicy;
use App\Policies\ChatRoomPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\TaskNotePolicy;
use App\Policies\TaskPolicy;
use Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(Task::class, TaskPolicy::class);
        Gate::policy(TaskNote::class, TaskNotePolicy::class);
        Gate::policy(ChatRoom::class, ChatRoomPolicy::class);
        Gate::policy(ChatMessage::class, ChatMessagePolicy::class);
    }
}
