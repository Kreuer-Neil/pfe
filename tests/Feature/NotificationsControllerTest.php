<?php

use App\Models\Project;
use App\Models\User;
use App\Notifications\ProjectMemberBannedNotification;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;

test('index returns only the current user\'s notifications, most recent first', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    $user->notify(new ProjectMemberBannedNotification($project = Project::factory()->create(['owner_id' => $user->id])));
    $other->notify(new ProjectMemberBannedNotification($project));

    actingAs($user);

    $response = get(route('notifications.index'));

    $response->assertOk();
    $response->assertJsonCount(1, 'notifications');
    $response->assertJsonPath('notifications.0.type', 'ProjectMemberBannedNotification');
    $response->assertJsonPath('unread_count', 1);
});

test('read marks a single notification as read and does not affect others', function () {
    $user = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $user->id]);

    $user->notify(new ProjectMemberBannedNotification($project));
    $user->notify(new ProjectMemberBannedNotification($project));

    actingAs($user);
    $notification = $user->notifications()->first();

    patch(route('notifications.read', $notification->id))->assertRedirect();

    expect($user->unreadNotifications()->count())->toBe(1)
        ->and($notification->fresh()->read_at)->not->toBeNull();
});

test('a user cannot mark another user\'s notification as read', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $other->id]);

    $other->notify(new ProjectMemberBannedNotification($project));
    $notification = $other->notifications()->first();

    actingAs($user);

    patch(route('notifications.read', $notification->id))->assertNotFound();

    expect($notification->fresh()->read_at)->toBeNull();
});

test('read-all marks every unread notification as read', function () {
    $user = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $user->id]);

    $user->notify(new ProjectMemberBannedNotification($project));
    $user->notify(new ProjectMemberBannedNotification($project));
    $user->notify(new ProjectMemberBannedNotification($project));

    actingAs($user);

    patch(route('notifications.read-all'))->assertRedirect();

    expect($user->unreadNotifications()->count())->toBe(0);
});
