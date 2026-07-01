<?php

use App\Http\Controllers\TaskNoteController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

Route::get('tasks', [TaskController::class, 'index'])
    ->name('tasks');

Route::post('tasks/store', [TaskController::class, 'store'])
    ->name('tasks.store');

Route::get('tasks/{id}', [TaskController::class, 'show'])
    ->name('tasks.show');

Route::post('tasks/{id}/participate', [TaskController::class, 'participate'])
    ->name('tasks.participate');

Route::post('tasks/{id}/cancel', [TaskController::class, 'cancelParticipation'])
    ->name('tasks.participate.destroy');

Route::post('tasks/{id}/validate', [TaskController::class, 'validate'])
    ->name('tasks.validate');

Route::post('tasks/{id}/update', [TaskController::class, 'update'])
    ->name('tasks.update');

Route::post('tasks/{id}/destroy', [TaskController::class, 'destroy'])
    ->name('tasks.destroy');

Route::post('tasks/{id}/notes/store', [TaskNoteController::class, 'store'])
    ->name('tasks.notes.store');

Route::post('tasks/notes/{noteId}/update', [TaskNoteController::class, 'update'])
    ->name('tasks.notes.update');

Route::post('tasks/notes/{noteId}/delete', [TaskNoteController::class, 'destroy'])
    ->name('tasks.notes.destroy');
