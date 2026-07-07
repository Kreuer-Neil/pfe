<?php

use App\Http\Controllers\OnboardingController;
use Illuminate\Support\Facades\Route;

Route::get('onboarding', [OnboardingController::class, 'edit'])
    ->name('onboarding.edit');

Route::post('onboarding/complete', [OnboardingController::class, 'complete'])
    ->name('onboarding.complete');