<?php

use App\Http\Controllers\FrontpageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [FrontpageController::class, 'index'])
    ->name('frontpage.index');

Route::get('/policy', [FrontpageController::class, 'policy'])
    ->name('frontpage.policy');

Route::get('/contact', [FrontpageController::class, 'contact'])
    ->name('frontpage.contact');


// Contact/FAQ route
