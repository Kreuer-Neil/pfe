<?php

use App\Http\Controllers\UserProfileController;

Route::get('profile/{id}', [UserProfileController::class, 'show'])
    ->name('user-profile.show');
Route::post('profile/{id}/update', [UserProfileController::class, 'update'])
    ->name('user-profile.update');

Route::get('profile/{id}/follow', [UserProfileController::class, 'follow'])
    ->name('user-profile.follow');
Route::get('profile/{id}/unfollow', [UserProfileController::class, 'unfollow'])
    ->name('user-profile.unfollow');
