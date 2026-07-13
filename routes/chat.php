<?php

use App\Http\Controllers\ChatMessagesController;
use App\Http\Controllers\ChatRoomController;

Route::get('projects/{slug}/chats', [ChatRoomController::class, 'index'])
    ->name('projects.chats.index');
Route::get('projects/{slug}/chats/{room}', [ChatRoomController::class, 'show'])
    ->name('projects.chats.show');

Route::post('projects/{slug}/chats/{room}/messages/store', [ChatMessagesController::class, 'store'])
    ->name('projects.chats.messages.store');

Route::post('chats/messages/{message}/update', [ChatMessagesController::class, 'update'])
    ->name('chats.messages.update');
Route::post('chats/messages/{message}/destroy', [ChatMessagesController::class, 'destroy'])
    ->name('chats.messages.destroy');
