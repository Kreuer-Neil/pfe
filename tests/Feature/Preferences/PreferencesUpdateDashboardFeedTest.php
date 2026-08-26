<?php

use App\Models\User;

test('a user can hide the dashboard feed section', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->patch(route('preferences.update.dashboard-feed'), [
        'dashboard_feed_hidden' => '1',
    ])->assertRedirect();

    expect($user->preferences->fresh()->dashboard_feed_hidden)->toBeTrue();
});

test('a user can re-enable the dashboard feed section', function () {
    $user = User::factory()->create();
    $user->preferences->update(['dashboard_feed_hidden' => true]);
    $this->actingAs($user);

    $this->patch(route('preferences.update.dashboard-feed'), [
        'dashboard_feed_hidden' => '0',
    ])->assertRedirect();

    expect($user->preferences->fresh()->dashboard_feed_hidden)->toBeFalse();
});

test('dashboard_feed_hidden defaults to false when no preference has been set', function () {
    $user = User::factory()->create();

    expect($user->preferences->dashboard_feed_hidden)->toBeFalse();
});
