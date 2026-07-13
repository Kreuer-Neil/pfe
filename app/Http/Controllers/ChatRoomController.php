<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatMessageResource;
use App\Http\Resources\Project\ProjectContextResource;
use App\Models\ChatRoom;
use App\Models\Project;
use Gate;
use Inertia\Inertia;

class ChatRoomController extends Controller
{
    public function index(string $slug)
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        // Projects created before the chat feature don't have a default room yet.
        $chatRoom = $project->defaultChatRoom()
            ?? ChatRoom::create(['project_id' => $project->id]);

        return redirect()->route('projects.chats.show', [$project->slug, $chatRoom->id]);
    }

    public function show(string $slug, int $room)
    {
        $project = Project::where('slug', $slug)->firstOrFail();
        $chatRoom = $project->chatRooms()->findOrFail($room);

        Gate::authorize('view', $chatRoom);

        $chatRoom->markVisited(auth()->user());

        $messages = $chatRoom->messages()
            ->with(['owner', 'replyTo.owner'])
            ->latest()
            ->paginate(50);

        return Inertia::render('chats/chats-show', [
            'project' => (new ProjectContextResource($project))->toArray(request()),
            'chatRoom' => [
                'id' => $chatRoom->id,
                'name' => $chatRoom->name,
            ],
            'messages' => ChatMessageResource::collection($messages->reverse()->values())->toArray(request()),
            'messagesNextPage' => $messages->currentPage() < $messages->lastPage() ? $messages->currentPage() + 1 : null,
            'canPost' => Gate::allows('sendMessage', $chatRoom),
        ]);
    }
}
