<?php

use App\Http\Controllers\ChatMessagesController;
use App\Http\Controllers\ChatRoomController;

Route::get('projects/{project}/chats', [ChatRoomController::class, 'index'])
    ->name('projects.chats.index');
Route::get('projects/{project}/chats/{room}', [ChatRoomController::class, 'show'])
    ->name('projects.chats.show');

Route::post('projects/{project}/chats/{room}/messages/store', [ChatMessagesController::class, 'store'])
    ->name('projects.chats.messages.store');

Route::post('chats/messages/{message}/update', [ChatMessagesController::class, 'update'])
    ->name('chats.messages.update');
Route::post('chats/messages/{message}/destroy', [ChatMessagesController::class, 'destroy'])
    ->name('chats.messages.destroy');
