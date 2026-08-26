<?php

use App\Http\Controllers\LocationController;
use Illuminate\Support\Facades\Route;

Route::get('locations/search', [LocationController::class, 'search'])
    ->middleware('throttle:60,1')
    ->name('locations.search');