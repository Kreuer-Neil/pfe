<?php

use App\Enums\ProjectRole;
use App\Models\ChatMessage;
use App\Models\ChatRoom;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->project = Project::factory()->create(['owner_id' => $this->owner->id, 'is_private' => false]);
    $this->chatRoom = ChatRoom::create(['project_id' => $this->project->id, 'type' => 'default']);

    $this->memberUser = User::factory()->create();
    $this->externalUser = User::factory()->create();

    Member::firstOrCreate(['user_id' => $this->owner->id, 'project_id' => $this->project->id], ['role' => ProjectRole::ADMIN]);
    Member::firstOrCreate(['user_id' => $this->memberUser->id, 'project_id' => $this->project->id], ['role' => ProjectRole::MEMBER]);
});

test('a project member can view the chat room and its messages', function () {
    ChatMessage::create([
        'chat_room_id' => $this->chatRoom->id,
        'user_id' => $this->owner->id,
        'content' => 'Welcome to the project',
    ]);

    $this->actingAs($this->memberUser);

    $this->get(route('projects.chats.show', [$this->project->slug, $this->chatRoom->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('chats/chats-show')
            ->has('messages', 1)
            ->where('canPost', true)
        );
});

test('a non-member cannot view the chat room', function () {
    $this->actingAs($this->externalUser);

    $this->get(route('projects.chats.show', [$this->project->slug, $this->chatRoom->id]))
        ->assertForbidden();
});

test('viewing the chat room marks it as visited', function () {
    $this->actingAs($this->memberUser);

    $this->get(route('projects.chats.show', [$this->project->slug, $this->chatRoom->id]));

    $this->assertDatabaseHas('chat_last_visits', [
        'user_id' => $this->memberUser->id,
        'chat_room_id' => $this->chatRoom->id,
    ]);
});
