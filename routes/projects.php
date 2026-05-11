<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('projects', [ProjectController::class, 'index'])
    ->name('projects');

Route::get('projects/search', [ProjectController::class, 'indexSearch'])
    ->name('projects.search');

// TODO use slug
Route::get('projects/{project}', [ProjectController::class, 'show'])
    ->name('projects.show');
