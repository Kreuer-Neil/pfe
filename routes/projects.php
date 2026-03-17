<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth','verified'])->group(function() {

    Route::get('projects', [ProjectController::class, 'index'])
        ->name('projects');

    Route::get('projects/{project}', [ProjectController::class, 'show'])
        ->name('projects.show');
});
