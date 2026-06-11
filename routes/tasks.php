<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

Route::get('tasks', [TaskController::class, 'index'])
    ->name('tasks');

Route::get('tasks/create', [TaskController::class, 'store'])
    ->name('tasks.store');

Route::get('tasks/{id}', [TaskController::class, 'show'])
    ->name('tasks.show');

Route::get('tasks/{id}/participate', [TaskController::class, 'participate'])
    ->name('tasks.participate');

Route::get('tasks/{id}/cancel', [TaskController::class, 'cancelParticipation'])
    ->name('tasks.participate.destroy');

Route::get('tasks/{id}/validate', [TaskController::class, 'validate'])
    ->name('tasks.validate');

Route::get('tasks/{id}/edit', [TaskController::class, 'update'])
    ->name('tasks.update');

Route::get('tasks/{id}/delete', [TaskController::class, 'destroy'])
    ->name('tasks.destroy');
