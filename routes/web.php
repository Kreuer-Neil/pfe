<?php

use App\Http\Controllers\AuthPageController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');*/

//Route::get('register', [AuthPageController::class, 'register'])
//    ->name('register');
//Route::get('login', [AuthPageController::class, 'login'])
//    ->name('login');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    require __DIR__ . '/profile.php';
    require __DIR__ . '/projects.php';

    Route::get('users/{id}', );
});

require __DIR__ . '/auth.php';
require __DIR__ . '/frontpage.php';
require __DIR__ . '/design.php';
