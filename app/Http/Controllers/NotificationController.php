<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = auth()->user()->notifications()->limit(20)->get();

        return response()->json([
            'notifications' => NotificationResource::collection($notifications)->toArray(request()),
            'unread_count' => auth()->user()->unreadNotifications()->count(),
        ]);
    }

    public function read(string $id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return redirect()->back();
    }

    public function readAll()
    {
        auth()->user()->unreadNotifications()->update(['read_at' => now()]);

        return redirect()->back();
    }
}
