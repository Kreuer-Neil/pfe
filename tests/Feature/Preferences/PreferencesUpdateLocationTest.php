<?php

use App\Models\User;

// seedNominatimCache() is defined once, globally, in tests/Pest.php

test('user can set their location from a cached search result', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    seedNominatimCache('Liège', '1407192', 'relation');

    $this->patch(route('preferences.update.location'), [
        'q' => 'Liège',
        'osm_id' => '1407192',
        'osm_type' => 'relation',
    ])->assertRedirect(route('preferences.edit'));

    expect($user->preferences->fresh()->location)->not->toBeNull()
        ->and($user->preferences->fresh()->location->display_name)->toBe('Liège, Wallonie, Belgique');
});

test('submitting no location clears a previously set location', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    seedNominatimCache('Liège', '1407192', 'relation');
    $this->patch(route('preferences.update.location'), [
        'q' => 'Liège', 'osm_id' => '1407192', 'osm_type' => 'relation',
    ]);
    expect($user->preferences->fresh()->location_id)->not->toBeNull();

    $this->patch(route('preferences.update.location'), [])
        ->assertRedirect(route('preferences.edit'));

    expect($user->preferences->fresh()->location_id)->toBeNull();
});

test('an osm_id not present in the cached results fails with an expired-selection error', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    seedNominatimCache('Liège', '1407192', 'relation');

    $this->patch(route('preferences.update.location'), [
        'q' => 'Liège',
        'osm_id' => '999999',
        'osm_type' => 'relation',
    ])->assertSessionHasErrors('osm_id');

    expect($user->preferences->fresh()->location_id)->toBeNull();
});
