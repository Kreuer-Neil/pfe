<?php

use App\Models\User;

test('users who have not onboarded are redirected away from the app', function () {
    $user = User::factory()->create();
    $user->preferences->update(['onboarding_completed_at' => null]);
    $this->actingAs($user);

    $this->get(route('dashboard'))->assertRedirect(route('onboarding.edit'));
});

test('users who have not onboarded can still reach the onboarding page and its dependencies', function () {
    $user = User::factory()->create();
    $user->preferences->update(['onboarding_completed_at' => null]);
    $this->actingAs($user);

    $this->get(route('onboarding.edit'))->assertOk();
});

test('onboarded users are not redirected', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('dashboard'))->assertOk();
});

test('finishing the location step marks onboarding as complete and redirects to the dashboard', function () {
    $user = User::factory()->create();
    $user->preferences->update(['onboarding_completed_at' => null]);
    $this->actingAs($user);

    $this->post(route('onboarding.complete'))->assertRedirect(route('dashboard'));

    expect($user->preferences->fresh()->onboarding_completed_at)->not->toBeNull();
});