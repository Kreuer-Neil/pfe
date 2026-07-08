<?php

use App\Models\Language;
use App\Models\User;

// updateLanguages() redirects via back() -> sending from preferences route since onboarding also uses the preferred languages/tags update.

test('user can set their preferred languages', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->from(route('preferences.edit'))->post(route('preferences.update.languages'), [
        'languages' => ['FR', 'EN'],
    ])->assertRedirect(route('preferences.edit'));

    expect($user->preferences->languages()->pluck('name')->sort()->values()->all())
        ->toBe(['EN', 'FR']);
});

test('submitting an empty languages array clears selected languages', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    $user->preferences->languages()->sync(Language::whereIn('name', ['FR'])->pluck('id'));

    $this->from(route('preferences.edit'))->post(route('preferences.update.languages'), ['languages' => []])
        ->assertRedirect(route('preferences.edit'));

    expect($user->preferences->languages()->count())->toBe(0);
});

test('an unknown language code is rejected', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('preferences.update.languages'), [
        'languages' => ['XX'],
    ])->assertSessionHasErrors('languages.0');

    expect($user->preferences->languages()->count())->toBe(0);
});
