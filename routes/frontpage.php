<?php

use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\FrontpageController;
use App\Http\Controllers\SupportController;
use Illuminate\Support\Facades\Route;

Route::get('/', [FrontpageController::class, 'index'])
    ->name('frontpage.index');

Route::get('/policy', [FrontpageController::class, 'policy'])
    ->name('frontpage.policy');
Route::get('/contact', [FrontpageController::class, 'contact'])
    ->name('frontpage.contact');
Route::post('/contact', [ContactFormController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('frontpage.contact.store');
Route::get('/team', [FrontpageController::class, 'team'])
    ->name('frontpage.team');
Route::get('/support', [SupportController::class, 'index'])
    ->name('frontpage.support');
Route::get('/support/faq', [SupportController::class, 'faq'])
    ->name('frontpage.faq');

// Contact/FAQ route
