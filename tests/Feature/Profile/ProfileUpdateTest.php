<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use App\Jobs\HandleProfileImageUploads;

test('a user can update their own profile', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->patch(route('user-profile.update', $user->id), [
        'nickname' => 'newnickname',
        'pronouns' => 'they/them',
        'bio' => 'Updated bio',
    ]);

    $response->assertRedirect(route('user-profile.show', $user->id));

    $user->refresh();
    expect($user->nickname)->toBe('newnickname')
        ->and($user->pronouns)->toBe('they/them')
        ->and($user->bio)->toBe('Updated bio');
});

test('pronouns and bio are cleared when emptied (nullable)', function () {
    $user = User::factory()->create(['pronouns' => 'she/her', 'bio' => 'Old bio']);

    $response = $this->actingAs($user)->patch(route('user-profile.update', $user->id), [
        'nickname' => 'somenickname',
    ]);

    $response->assertRedirect(route('user-profile.show', $user->id));

    $user->refresh();
    expect($user->pronouns)->toBeNull()
        ->and($user->bio)->toBeNull();
});

test('nickname is not required', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('user-profile.update', $user->id), ['nickname' => ''])
        ->assertSessionHasNoErrors();
});

test('nickname must be at least 3 characters', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('user-profile.update', $user->id), ['nickname' => 'ab'])
        ->assertSessionHasErrors('nickname');
});

test('nickname must be at most 32 characters', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('user-profile.update', $user->id), ['nickname' => str_repeat('a', 33)])
        ->assertSessionHasErrors('nickname');
});

test('bio must be at most 255 characters', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('user-profile.update', $user->id), [
            'nickname' => 'validnick',
            'bio' => str_repeat('a', 256),
        ])
        ->assertSessionHasErrors('bio');
});

test('a user cannot update another users profile', function () {
    $user = User::factory()->create();
    $other = User::factory()->create(['nickname' => 'original']);

    $this->actingAs($user)
        ->patch(route('user-profile.update', $other->id), ['nickname' => 'hacked'])
        ->assertForbidden();

    expect($other->fresh()->nickname)->toBe('original');
});

test('uploading an avatar dispatches the image processing job and saves the filename', function () {
    Queue::fake();
    $user = User::factory()->create();

    $response = $this->actingAs($user)->patch(route('user-profile.update', $user->id), [
        'nickname' => 'withavatar',
        'avatar' => UploadedFile::fake()->image('avatar.jpg'),
    ]);

    $response->assertRedirect(route('user-profile.show', $user->id));
    Queue::assertPushed(HandleProfileImageUploads::class);
    expect($user->fresh()->avatar)->not->toBeNull();
});

test('avatar must be an image', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('user-profile.update', $user->id), [
            'nickname' => 'test',
            'avatar' => UploadedFile::fake()->create('not-an-image.pdf', 100),
        ])
        ->assertSessionHasErrors('avatar');
});

test('avatar must respect the max file size', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('user-profile.update', $user->id), [
            'nickname' => 'test',
            // max:2048 is in KB - 3000 KB exceeds it.
            'avatar' => UploadedFile::fake()->image('too-big.jpg')->size(3000),
        ])
        ->assertSessionHasErrors('avatar');
});
