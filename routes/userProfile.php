<?php

use App\Http\Controllers\UserProfileController;

Route::get('profile/{id}', [UserProfileController::class, 'show'])
    ->name('user-profile.show');
