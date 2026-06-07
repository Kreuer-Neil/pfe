<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectInvitationController;
use Illuminate\Support\Facades\Route;


Route::get('projects', [ProjectController::class, 'index'])
    ->name('projects');

Route::get('projects/search', [ProjectController::class, 'indexSearch'])
    ->name('projects.search');

Route::get('projects/my-projects', [ProjectController::class, 'myProjects'])
    ->name('project.my-projects');

Route::get('projects/create', [ProjectController::class, 'create'])
    ->name('projects.create');

Route::get('projects/store', [ProjectController::class, 'store'])
    ->name('projects.store');

Route::get('projects/invitations', [ProjectInvitationController::class, 'index'])
    ->name('projects.invitations');

Route::get('projects/invitations/show', [ProjectInvitationController::class, 'show'])
    ->name('projects.invitations.show');

Route::get('projects/invitations/{code}', [ProjectInvitationController::class, 'use'])
    ->name('projects.invitations.use');

Route::get('projects/{slug}', [ProjectController::class, 'show'])
    ->name('projects.show');

Route::get('projects/{slug}/join', [ProjectController::class, 'join'])
    ->name('projects.join');

Route::post('projects/{slug}/update/appearance', [ProjectController::class, 'updateAppearance'])
    ->name('projects.update.appearance');

