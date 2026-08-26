<?php

use App\Http\Controllers\UserProfileController;

Route::get('profile/{id}', [UserProfileController::class, 'show'])
    ->name('user-profile.show');
Route::get('profile/{id}/edit', [UserProfileController::class, 'edit'])
    ->name('user-profile.edit');
Route::patch('profile/{id}/update', [UserProfileController::class, 'update'])
    ->name('user-profile.update');

Route::post('profile/{id}/follow', [UserProfileController::class, 'follow'])
    ->name('user-profile.follow');
Route::delete('profile/{id}/unfollow', [UserProfileController::class, 'unfollow'])
    ->name('user-profile.unfollow');
