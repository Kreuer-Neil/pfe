<?php

use App\Http\Controllers\UserProfileController;

Route::get('profile/{user}', [UserProfileController::class, 'show'])
    ->name('user-profile.show');
Route::get('profile/{user}/edit', [UserProfileController::class, 'edit'])
    ->name('user-profile.edit');
Route::patch('profile/{user}/update', [UserProfileController::class, 'update'])
    ->name('user-profile.update');

Route::post('profile/{user}/follow', [UserProfileController::class, 'follow'])
    ->name('user-profile.follow');
Route::delete('profile/{user}/unfollow', [UserProfileController::class, 'unfollow'])
    ->name('user-profile.unfollow');
