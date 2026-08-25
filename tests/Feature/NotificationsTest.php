<?php

use App\Enums\NotificationType;
use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\NotificationPreference;
use App\Models\Participation;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Notifications\ProjectMemberBannedNotification;
use App\Notifications\TaskDueSoonNotification;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

test('user gets notified on their dashboard when a task is soon due and task notifications are active', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $participant = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $participant->id, 'role' => ProjectRole::MEMBER->value]);

    $task = Task::factory()->create([
        'project_id' => $project->id,
        'user_id' => $owner->id,
        'due_at' => now()->addHours(12),
        'validated_at' => null,
    ]);
    Participation::create(['task_id' => $task->id, 'user_id' => $participant->id]);

    Artisan::call('notifications:due-tasks');

    Notification::assertSentTo(
        $participant,
        TaskDueSoonNotification::class,
        fn ($notification) => $notification->toArray($participant)['task_id'] === $task->id,
    );
});

test('a task due more than 24 hours away does not notify participants yet', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $participant = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $participant->id, 'role' => ProjectRole::MEMBER->value]);

    $task = Task::factory()->create([
        'project_id' => $project->id,
        'user_id' => $owner->id,
        'due_at' => now()->addDays(3),
        'validated_at' => null,
    ]);
    Participation::create(['task_id' => $task->id, 'user_id' => $participant->id]);

    Artisan::call('notifications:due-tasks');

    Notification::assertNothingSent();
});

test('re-running the due-tasks command does not notify the same participant twice', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $participant = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $participant->id, 'role' => ProjectRole::MEMBER->value]);

    $task = Task::factory()->create([
        'project_id' => $project->id,
        'user_id' => $owner->id,
        'due_at' => now()->addHours(12),
        'validated_at' => null,
    ]);
    Participation::create(['task_id' => $task->id, 'user_id' => $participant->id]);

    Artisan::call('notifications:due-tasks');
    Artisan::call('notifications:due-tasks');

    expect($participant->notifications()->where('type', TaskDueSoonNotification::class)->count())->toBe(1);
});

test('user gets notified when kicked/banned from a project', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $target = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $target->id, 'role' => ProjectRole::MEMBER->value]);
    actingAs($owner);

    post(route('projects.update.member-ban', $project->slug), [
        'user_id' => $target->id,
    ])->assertRedirect();

    Notification::assertSentTo(
        $target,
        ProjectMemberBannedNotification::class,
        fn ($notification) => $notification->toArray($target)['project_id'] === $project->id,
    );
});

test('changing a member role to something other than banned does not notify', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $target = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $target->id, 'role' => ProjectRole::MEMBER->value]);
    actingAs($owner);

    post(route('projects.update.member-role', $project->slug), [
        'user_id' => $target->id,
        'role' => ProjectRole::MODERATOR->value,
    ])->assertRedirect();

    Notification::assertNotSentTo($target, ProjectMemberBannedNotification::class);
});

test('task due soon notification includes the mail channel by default', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $participant = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $participant->id, 'role' => ProjectRole::MEMBER->value]);

    $task = Task::factory()->create([
        'project_id' => $project->id,
        'user_id' => $owner->id,
        'due_at' => now()->addHours(12),
        'validated_at' => null,
    ]);
    Participation::create(['task_id' => $task->id, 'user_id' => $participant->id]);

    Artisan::call('notifications:due-tasks');

    Notification::assertSentTo(
        $participant,
        TaskDueSoonNotification::class,
        fn ($notification, $channels) => in_array('mail', $channels),
    );
});

test('task due soon notification skips the mail channel when the user disabled it', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $participant = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $participant->id, 'role' => ProjectRole::MEMBER->value]);
    NotificationPreference::create([
        'user_id' => $participant->id,
        'type' => NotificationType::TASK_DUE_SOON->value,
        'email_enabled' => false,
    ]);

    $task = Task::factory()->create([
        'project_id' => $project->id,
        'user_id' => $owner->id,
        'due_at' => now()->addHours(12),
        'validated_at' => null,
    ]);
    Participation::create(['task_id' => $task->id, 'user_id' => $participant->id]);

    Artisan::call('notifications:due-tasks');

    Notification::assertSentTo(
        $participant,
        TaskDueSoonNotification::class,
        fn ($notification, $channels) => !in_array('mail', $channels),
    );
});

test('project member banned notification skips the mail channel when the user disabled it', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $target = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $target->id, 'role' => ProjectRole::MEMBER->value]);
    NotificationPreference::create([
        'user_id' => $target->id,
        'type' => NotificationType::PROJECT_MEMBER_BANNED->value,
        'email_enabled' => false,
    ]);
    actingAs($owner);

    post(route('projects.update.member-ban', $project->slug), [
        'user_id' => $target->id,
    ])->assertRedirect();

    Notification::assertSentTo(
        $target,
        ProjectMemberBannedNotification::class,
        fn ($notification, $channels) => !in_array('mail', $channels),
    );
});
