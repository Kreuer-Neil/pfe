<?php

use App\Models\Language;
use App\Models\User;

test('switching language as a guest only sets the cookie', function () {
    $response = $this->get(route('lang', ['lang' => 'fr']));

    $response->assertCookie('lang', 'fr');
});

test('switching language as an authenticated user also persists it on the user', function () {
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->get(route('lang', ['lang' => 'fr']));

    expect($user->refresh()->language?->name)->toBe('FR')
        ->and($user->locale())->toBe('fr');
});

test('switching language reuses an existing language row instead of duplicating it', function () {
    $existing = Language::firstOrCreate(['name' => 'FR']);
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->get(route('lang', ['lang' => 'fr']));

    expect($user->refresh()->language_id)->toBe($existing->id)
        ->and(Language::where('name', 'FR')->count())->toBe(1);
});

test('an unsupported language code does not persist anything', function () {
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->get(route('lang', ['lang' => 'zz']));

    expect($user->refresh()->language_id)->toBeNull();
});