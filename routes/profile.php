<?php

use App\Http\Controllers\NotificationPreferencesController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use App\Http\Controllers\UserPreferencesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::redirect('settings', '/settings/profile');
Route::get('settings', [ProfileController::class, 'index'])
    ->name('settings');

Route::get('settings/profile', [ProfileController::class, 'edit'])
    ->name('profile.edit');
Route::patch('settings/profile', [ProfileController::class, 'update'])
    ->name('profile.update');
Route::delete('settings/profile', [ProfileController::class, 'destroy'])
    ->name('profile.destroy');

Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');

Route::put('settings/password', [PasswordController::class, 'update'])
    ->middleware('throttle:6,1')
    ->name('password.update');

// Route::get('settings/appearance', function () {
//    return Inertia::render('settings/appearance');
// })->name('appearance.edit');

Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
    ->name('two-factor.show');

Route::get('settings/preferences', [UserPreferencesController::class, 'edit'])
    ->name('preferences.edit');
Route::patch('settings/preferences/location', [UserPreferencesController::class, 'updateLocation'])
    ->name('preferences.update.location');
Route::patch('settings/preferences/dashboard-feed', [UserPreferencesController::class, 'updateDashboardFeedVisibility'])
    ->name('preferences.update.dashboard-feed');

Route::get('settings/notifications', [NotificationPreferencesController::class, 'edit'])
    ->name('notification-preferences.edit');
Route::put('settings/notifications', [NotificationPreferencesController::class, 'update'])
    ->name('notification-preferences.update');
