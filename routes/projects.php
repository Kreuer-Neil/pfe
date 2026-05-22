<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('projects', [ProjectController::class, 'index'])
    ->name('projects');

Route::get('projects/search', [ProjectController::class, 'indexSearch'])
    ->name('projects.search');

Route::get('projects/{slug}', [ProjectController::class, 'show'])
    ->name('projects.show');

Route::get('tasks', [TaskController::class, 'index'])
    ->name('tasks');

Route::get('tasks/create', [TaskController::class, 'store'])
    ->name('tasks.store');

Route::get('tasks/{id}', [TaskController::class, 'show'])
    ->name('tasks.show');

Route::get('tasks/{id}/participate', [TaskController::class, 'participate'])
    ->name('tasks.participate');
