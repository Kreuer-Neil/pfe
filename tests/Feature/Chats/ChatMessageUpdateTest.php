<?php

use App\Enums\ProjectRole;
use App\Events\MessageUpdatedEvent;
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

    $this->authorUser = User::factory()->create();
    $this->otherMember = User::factory()->create();

    foreach ([
        [$this->owner, ProjectRole::ADMIN],
        [$this->authorUser, ProjectRole::MEMBER],
        [$this->otherMember, ProjectRole::MEMBER],
    ] as [$user, $role]) {
        Member::firstOrCreate(['user_id' => $user->id, 'project_id' => $this->project->id], ['role' => $role]);
    }

    $this->message = ChatMessage::create([
        'chat_room_id' => $this->chatRoom->id,
        'user_id' => $this->authorUser->id,
        'content' => 'Original content',
    ]);
});

test('the author can update their own message and it is broadcast', function () {
    Event::fake([MessageUpdatedEvent::class]);

    $this->actingAs($this->authorUser);

    $this->patch(route('chats.messages.update', $this->message->id), [
        'content' => 'Updated content',
    ])->assertRedirect();

    $this->assertDatabaseHas('chat_messages', [
        'id' => $this->message->id,
        'content' => 'Updated content',
    ]);

    $messageId = $this->message->id;

    Event::assertDispatched(MessageUpdatedEvent::class, function (MessageUpdatedEvent $event) use ($messageId) {
        return $event->message->id === $messageId
            && $event->message->content === 'Updated content';
    });
});

test('another member cannot update someone else\'s message', function () {
    Event::fake([MessageUpdatedEvent::class]);

    $this->actingAs($this->otherMember);

    $this->patch(route('chats.messages.update', $this->message->id), [
        'content' => 'Hijacked content',
    ])->assertForbidden();

    $this->assertDatabaseMissing('chat_messages', ['content' => 'Hijacked content']);
    Event::assertNotDispatched(MessageUpdatedEvent::class);
});

test('message content is required on update', function () {
    $this->actingAs($this->authorUser);

    $this->patch(route('chats.messages.update', $this->message->id), [
        'content' => '',
    ])->assertSessionHasErrors('content');
});

test('broadcasting an updated message does not require an authenticated viewer', function () {
    $message = $this->message->fresh(['owner', 'replyTo.owner']);

    $payload = (new MessageUpdatedEvent($message))->broadcastWith();

    expect($payload['message']['content'])->toBe('Original content')
        ->and($payload['message']['is_owner'])->toBeFalse()
        ->and($payload['message']['owner']['is_following'])->toBeFalse();
});
