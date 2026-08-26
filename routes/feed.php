<?php

use App\Http\Controllers\FeedController;
use Illuminate\Support\Facades\Route;

Route::get('feed', [FeedController::class, 'index'])
    ->name('feed.index');
