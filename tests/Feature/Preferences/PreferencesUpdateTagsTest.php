<?php

use App\Models\Tag;
use App\Models\User;

// updateTags() redirects via back() (not a hardcoded route) so it works from both the settings
// page and the onboarding wizard - simulate a real referer via from() so assertRedirect has
// something meaningful to check, same as a real browser would send.

test('user can set their preferred tags', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->from(route('preferences.edit'))->patch(route('preferences.update.tags'), [
        'tags' => ['nature', 'insects'],
    ])->assertRedirect(route('preferences.edit'));

    expect($user->preferences->tags()->pluck('name')->sort()->values()->all())
        ->toBe(['insects', 'nature']);
});

test('submitting no tags clears any previously selected tags', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    $user->preferences->tags()->sync(Tag::whereIn('name', ['nature', 'music'])->pluck('id'));
    expect($user->preferences->tags()->count())->toBe(2);

    $this->from(route('preferences.edit'))->patch(route('preferences.update.tags'), [])
        ->assertRedirect(route('preferences.edit'));

    expect($user->preferences->tags()->count())->toBe(0);
});

test('submitting an empty tags array also clears selected tags', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    $user->preferences->tags()->sync(Tag::whereIn('name', ['nature'])->pluck('id'));

    $this->from(route('preferences.edit'))->patch(route('preferences.update.tags'), ['tags' => []])
        ->assertRedirect(route('preferences.edit'));

    expect($user->preferences->tags()->count())->toBe(0);
});

test('an unknown tag is rejected', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->patch(route('preferences.update.tags'), [
        'tags' => ['not-a-real-tag'],
    ])->assertSessionHasErrors('tags.0');

    expect($user->preferences->tags()->count())->toBe(0);
});

test('more than 7 tags is rejected', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $tags = Tag::query()->limit(8)->pluck('name')->all();
    expect($tags)->toHaveCount(8); // sanity check the seeder gives us enough tags to test this

    $this->patch(route('preferences.update.tags'), ['tags' => $tags])
        ->assertSessionHasErrors('tags');
});
