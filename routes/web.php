<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LanguageController;
use Illuminate\Support\Facades\Route;

/*
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');*/

//Route::get('register', [AuthPageController::class, 'register'])
//    ->name('register');
//Route::get('login', [AuthPageController::class, 'login'])
//    ->name('login');

Route::middleware(['auth', 'verified'])->group(function () {
    require __DIR__ . '/onboarding.php';
    require __DIR__ . '/location.php';
    require __DIR__ . '/preferences.php';
});

Route::middleware(['auth', 'verified', 'onboarded'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    require __DIR__ . '/profile.php';
    require __DIR__ . '/projects.php';
    require __DIR__ . '/tasks.php';
    require __DIR__ . '/chat.php';
    require __DIR__ . '/userProfile.php';
    require __DIR__ . '/notifications.php';

//    Route::get('users/{id}', );
});

require __DIR__ . '/auth.php';
require __DIR__ . '/frontpage.php';
require __DIR__ . '/design.php';

Route::get('lang', [LanguageController::class, 'switchLanguage'])
    ->name('lang');
