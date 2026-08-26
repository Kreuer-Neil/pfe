<?php

use App\Enums\NotificationType;
use App\Models\NotificationPreference;
use App\Models\User;

test('notification preferences page is displayed with defaults when no rows exist', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('notification-preferences.edit'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('settings/notifications')
        ->where('preferences', collect(NotificationType::cases())->map(fn ($type) => [
            'type' => $type->value,
            'email_enabled' => true,
        ])->values()->toArray())
    );
});

test('notification preferences page reflects an existing disabled preference', function () {
    $user = User::factory()->create();
    NotificationPreference::create([
        'user_id' => $user->id,
        'type' => NotificationType::TASK_DUE_SOON->value,
        'email_enabled' => false,
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('notification-preferences.edit'));

    $response->assertInertia(fn ($page) => $page
        ->where('preferences.0.type', NotificationType::TASK_DUE_SOON->value)
        ->where('preferences.0.email_enabled', false)
    );
});

test('notification preferences can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('notification-preferences.edit'))
        ->put(route('notification-preferences.update'), [
            'preferences' => [
                ['type' => NotificationType::TASK_DUE_SOON->value, 'email_enabled' => false],
                ['type' => NotificationType::PROJECT_MEMBER_BANNED->value, 'email_enabled' => true],
            ],
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('notification-preferences.edit'));

    expect($user->notificationPreferences()->where('type', NotificationType::TASK_DUE_SOON->value)->value('email_enabled'))->toBeFalse();
    expect($user->notificationPreferences()->where('type', NotificationType::PROJECT_MEMBER_BANNED->value)->value('email_enabled'))->toBeTrue();
});

test('updating notification preferences overwrites an existing row instead of duplicating it', function () {
    $user = User::factory()->create();
    NotificationPreference::create([
        'user_id' => $user->id,
        'type' => NotificationType::TASK_DUE_SOON->value,
        'email_enabled' => true,
    ]);

    $this
        ->actingAs($user)
        ->put(route('notification-preferences.update'), [
            'preferences' => [
                ['type' => NotificationType::TASK_DUE_SOON->value, 'email_enabled' => false],
            ],
        ]);

    expect($user->notificationPreferences()->where('type', NotificationType::TASK_DUE_SOON->value)->count())->toBe(1);
    expect($user->notificationPreferences()->where('type', NotificationType::TASK_DUE_SOON->value)->value('email_enabled'))->toBeFalse();
});