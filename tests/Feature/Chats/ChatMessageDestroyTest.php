<?php

use App\Enums\ProjectRole;
use App\Events\MessageDeletedEvent;
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
    $this->moderatorUser = User::factory()->create();
    $this->otherMember = User::factory()->create();

    foreach ([
        [$this->owner, ProjectRole::ADMIN],
        [$this->authorUser, ProjectRole::MEMBER],
        [$this->moderatorUser, ProjectRole::MODERATOR],
        [$this->otherMember, ProjectRole::MEMBER],
    ] as [$user, $role]) {
        Member::firstOrCreate(['user_id' => $user->id, 'project_id' => $this->project->id], ['role' => $role]);
    }

    $this->message = ChatMessage::create([
        'chat_room_id' => $this->chatRoom->id,
        'user_id' => $this->authorUser->id,
        'content' => 'Delete me',
    ]);
});

test('the author can delete their own message and it is broadcast', function () {
    Event::fake([MessageDeletedEvent::class]);

    $this->actingAs($this->authorUser);

    $this->post(route('chats.messages.destroy', $this->message->id))->assertRedirect();

    $this->assertSoftDeleted('chat_messages', ['id' => $this->message->id]);

    $messageId = $this->message->id;

    Event::assertDispatched(MessageDeletedEvent::class, function (MessageDeletedEvent $event) use ($messageId) {
        return $event->message->id === $messageId;
    });
});

test('a moderator can delete another member\'s message', function () {
    Event::fake([MessageDeletedEvent::class]);

    $this->actingAs($this->moderatorUser);

    $this->post(route('chats.messages.destroy', $this->message->id))->assertRedirect();

    $this->assertSoftDeleted('chat_messages', ['id' => $this->message->id]);
});

test('a plain member cannot delete someone else\'s message', function () {
    Event::fake([MessageDeletedEvent::class]);

    $this->actingAs($this->otherMember);

    $this->post(route('chats.messages.destroy', $this->message->id))->assertForbidden();

    $this->assertDatabaseHas('chat_messages', ['id' => $this->message->id, 'deleted_at' => null]);
    Event::assertNotDispatched(MessageDeletedEvent::class);
});

test('broadcasting a deleted message does not require an authenticated viewer', function () {
    $message = ChatMessage::create([
        'chat_room_id' => $this->chatRoom->id,
        'user_id' => $this->authorUser->id,
        'content' => 'Soon to be deleted',
    ]);
    $message->delete();

    $payload = (new MessageDeletedEvent($message))->broadcastWith();

    expect($payload['message_id'])->toBe($message->id);
});
