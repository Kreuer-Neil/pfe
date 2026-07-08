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

// The tags/languages steps reuse UserPreferencesController::updateTags()/updateLanguages() directly, not an OnboardingController action.

test('a non-onboarded user can skip the tags step with no tags selected', function () {
    $user = User::factory()->create();
    $user->preferences->update(['onboarding_completed_at' => null]);
    $this->actingAs($user);

    $response = $this->post(route('preferences.update.tags'), []);

    $response->assertStatus(302);
    expect($response->headers->get('Location'))->not->toBe(route('onboarding.edit'))
        ->and($user->preferences->fresh()->tags()->count())->toBe(0);
});

test('a non-onboarded user can skip the languages step with no languages selected', function () {
    $user = User::factory()->create();
    $user->preferences->update(['onboarding_completed_at' => null]);
    $this->actingAs($user);

    $response = $this->post(route('preferences.update.languages'), []);

    $response->assertStatus(302);
    expect($response->headers->get('Location'))->not->toBe(route('onboarding.edit'))
        ->and($user->preferences->fresh()->languages()->count())->toBe(0);
});

test('a non-onboarded user can pick tags and languages before finishing onboarding', function () {
    $user = User::factory()->create();
    $user->preferences->update(['onboarding_completed_at' => null]);
    $this->actingAs($user);

    $this->post(route('preferences.update.tags'), ['tags' => ['nature']]);
    $this->post(route('preferences.update.languages'), ['languages' => ['EN']]);

    expect($user->preferences->fresh()->tags()->pluck('name')->all())->toBe(['nature'])
        ->and($user->preferences->fresh()->languages()->pluck('name')->all())->toBe(['EN']);
    // Still gated - picking tags/languages alone doesn't complete onboarding.
    $this->get(route('dashboard'))->assertRedirect(route('onboarding.edit'));
});
