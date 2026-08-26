<?php

use App\Models\User;
use App\Models\UserFollow;

test('a user can follow another user', function () {
    $user = User::factory()->create();
    $target = User::factory()->create();

    $response = $this->actingAs($user)->post(route('user-profile.follow', $target));

    $response->assertRedirect(route('user-profile.show', $target));
    $this->assertDatabaseHas('user_follows', [
        'user_id' => $user->id,
        'followed_user_id' => $target->id,
    ]);
});

test('following the same user twice does not create a duplicate row', function () {
    $user = User::factory()->create();
    $target = User::factory()->create();

    $this->actingAs($user)->post(route('user-profile.follow', $target));
    $this->actingAs($user)->post(route('user-profile.follow', $target));

    expect(UserFollow::where('user_id', $user->id)->where('followed_user_id', $target->id)->count())
        ->toBe(1);
});

test('a user cannot follow themself', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('user-profile.follow', $user));

    $this->assertDatabaseMissing('user_follows', [
        'user_id' => $user->id,
        'followed_user_id' => $user->id,
    ]);
});

test('following a nonexistent user returns a 404', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('user-profile.follow', 999999))
        ->assertNotFound();
});

test('a user can unfollow someone they follow', function () {
    $user = User::factory()->create();
    $target = User::factory()->create();
    UserFollow::create(['user_id' => $user->id, 'followed_user_id' => $target->id]);

    $response = $this->actingAs($user)->delete(route('user-profile.unfollow', $target));

    $response->assertRedirect(route('user-profile.show', $target));
    $this->assertDatabaseMissing('user_follows', [
        'user_id' => $user->id,
        'followed_user_id' => $target->id,
    ]);
});

test('unfollowing someone not followed is a no-op', function () {
    $user = User::factory()->create();
    $target = User::factory()->create();

    $response = $this->actingAs($user)->delete(route('user-profile.unfollow', $target));

    $response->assertRedirect(route('user-profile.show', $target));
    $this->assertDatabaseMissing('user_follows', [
        'user_id' => $user->id,
        'followed_user_id' => $target->id,
    ]);
});

test('unfollowing a nonexistent user returns a 404', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete(route('user-profile.unfollow', 999999))
        ->assertNotFound();
});
