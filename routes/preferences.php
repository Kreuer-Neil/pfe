<?php

use App\Http\Controllers\UserPreferencesController;
use Illuminate\Support\Facades\Route;

// Shared by both the settings page and the onboarding wizard's tags/languages steps -
// can't be behind the 'onboarded' gate (see routes/web.php), so kept in their own file
// instead of routes/profile.php (gated) or routes/onboarding.php (onboarding-only).
Route::post('settings/preferences/languages', [UserPreferencesController::class, 'updateLanguages'])
    ->name('preferences.update.languages');
Route::post('settings/preferences/tags', [UserPreferencesController::class, 'updateTags'])
    ->name('preferences.update.tags');