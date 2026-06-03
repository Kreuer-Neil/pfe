<?php

use App\Http\Controllers\UserProfileController;

Route::get('profile/{id}', [UserProfileController::class, 'show'])
    ->name('user-profile.show');
Route::post('profile/{id}/update', [UserProfileController::class, 'update'])
    ->name('user-profile.update');
