<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::get('notifications', [NotificationController::class, 'index'])
    ->name('notifications.index');

Route::patch('notifications/{id}/read', [NotificationController::class, 'read'])
    ->name('notifications.read');

Route::patch('notifications/read-all', [NotificationController::class, 'readAll'])
    ->name('notifications.read-all');