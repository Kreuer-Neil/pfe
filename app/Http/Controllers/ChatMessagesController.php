<?php

namespace App\Http\Controllers;

use App\Events\MessageSentEvent;
use App\Models\ChatMessage;
use App\Models\Project;
use Gate;
use Illuminate\Http\Request;

class ChatMessagesController extends Controller
{
    public function store(Request $request, string $slug, int $room)
    {
        $validated = $request->validate([
            'content' => 'required|string|min:1|max:4000',
            'chat_message_id' => 'nullable|integer|exists:chat_messages,id',
        ]);

        $project = Project::where('slug', $slug)->firstOrFail();
        $chatRoom = $project->chatRooms()->findOrFail($room);

        Gate::authorize('sendMessage', $chatRoom);

        if (!empty($validated['chat_message_id'])) {
            $replyedMessage = ChatMessage::find($validated['chat_message_id']);
            if (!($replyedMessage && $replyedMessage->chat_room_id === $chatRoom->id)) {
                return back()->withErrors(['chat_message_id' => __('validation.chat_message_not_found')]);
            }
        }

        $chatMessage = ChatMessage::create([
            'chat_room_id' => $chatRoom->id,
            'user_id' => auth()->user()->id,
            'chat_message_id' => $validated['chat_message_id'] ?? null,
            'content' => $validated['content'],
        ]);

        broadcast(new MessageSentEvent($chatMessage->load(['owner', 'replyTo.owner'])));

        return redirect()->back();
    }

    public function update(Request $request, int $message)
    {
        $validated = $request->validate([
            'content' => 'required|string|min:1|max:4000',
        ]);

        $chatMessage = ChatMessage::findOrFail($message);

        Gate::authorize('update', $chatMessage);

        $chatMessage->content = $validated['content'];
        $chatMessage->save();

        return redirect()->back();
    }

    public function destroy(int $message)
    {
        $chatMessage = ChatMessage::findOrFail($message);

        Gate::authorize('delete', $chatMessage);

        $chatMessage->delete();

        return redirect()->back();
    }
}
