<?php

use App\Enums\ProjectRole;
use App\Events\MessageSentEvent;
use App\Models\ChatMessage;
use App\Models\ChatRoom;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Event;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->project = Project::factory()->create(['owner_id' => $this->owner->id, 'is_private' => false]);
    $this->chatRoom = ChatRoom::create(['project_id' => $this->project->id, 'type' => 'default']);

    $this->memberUser = User::factory()->create();
    $this->externalUser = User::factory()->create();

    Member::firstOrCreate(['user_id' => $this->owner->id, 'project_id' => $this->project->id], ['role' => ProjectRole::ADMIN]);
    Member::firstOrCreate(['user_id' => $this->memberUser->id, 'project_id' => $this->project->id], ['role' => ProjectRole::MEMBER]);
});

test('a project member can send a message and it is broadcast', function () {
    Event::fake([MessageSentEvent::class]);

    $this->actingAs($this->memberUser);

    $this->post(route('projects.chats.messages.store', [$this->project->slug, $this->chatRoom->id]), [
        'content' => 'Hello there',
    ])->assertRedirect();

    $this->assertDatabaseHas('chat_messages', [
        'chat_room_id' => $this->chatRoom->id,
        'user_id' => $this->memberUser->id,
        'content' => 'Hello there',
    ]);

    $roomId = $this->chatRoom->id;

    Event::assertDispatched(MessageSentEvent::class, function (MessageSentEvent $event) use ($roomId) {
        return $event->message->chat_room_id === $roomId
            && $event->message->content === 'Hello there'
            && $event->message->relationLoaded('owner');
    });
});

test('a non-member cannot send a message', function () {
    Event::fake([MessageSentEvent::class]);

    $this->actingAs($this->externalUser);

    $this->post(route('projects.chats.messages.store', [$this->project->slug, $this->chatRoom->id]), [
        'content' => 'Hello there',
    ])->assertForbidden();

    $this->assertDatabaseMissing('chat_messages', ['content' => 'Hello there']);
    Event::assertNotDispatched(MessageSentEvent::class);
});

test('message content is required', function () {
    $this->actingAs($this->memberUser);

    $this->post(route('projects.chats.messages.store', [$this->project->slug, $this->chatRoom->id]), [
        'content' => '',
    ])->assertSessionHasErrors('content');
});

test('replying to a message from another chat room is rejected', function () {
    $otherRoom = ChatRoom::create(['project_id' => $this->project->id, 'type' => 'secondary']);
    $otherMessage = ChatMessage::create([
        'chat_room_id' => $otherRoom->id,
        'user_id' => $this->memberUser->id,
        'content' => 'From another room',
    ]);

    $this->actingAs($this->memberUser);

    $this->post(route('projects.chats.messages.store', [$this->project->slug, $this->chatRoom->id]), [
        'content' => 'Reply attempt',
        'chat_message_id' => $otherMessage->id,
    ])->assertSessionHasErrors('chat_message_id');

    $this->assertDatabaseMissing('chat_messages', ['content' => 'Reply attempt']);
});

test('broadcasting a new message does not require an authenticated viewer', function () {
    $message = ChatMessage::create([
        'chat_room_id' => $this->chatRoom->id,
        'user_id' => $this->memberUser->id,
        'content' => 'Queued broadcast payload',
    ])->load(['owner', 'replyTo.owner']);

    $payload = (new MessageSentEvent($message))->broadcastWith();

    expect($payload['message']['content'])->toBe('Queued broadcast payload')
        ->and($payload['message']['is_owner'])->toBeFalse()
        ->and($payload['message']['owner']['is_following'])->toBeFalse();
});
