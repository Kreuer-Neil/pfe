<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth','verified'])->group(function() {

    Route::get('projects/{project}', [ProjectController::class, 'show'])
        ->name('projects.show');

    Route::get('projects', [ProjectController::class, 'table'])->name('projects.table');

});
