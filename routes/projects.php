<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;


Route::get('projects', [ProjectController::class, 'index'])
    ->name('projects');

Route::get('projects/search', [ProjectController::class, 'indexSearch'])
    ->name('projects.search');

Route::get('projects/my-projects',[ProjectController::class,'myProjects'])
    ->name('project.my-projects');

Route::get('projects/create', [ProjectController::class,'create'])
    ->name('projects.create');

Route::get('projects/store', [ProjectController::class, 'store'])
    ->name('projects.store');

Route::get('projects/{slug}', [ProjectController::class, 'show'])
    ->name('projects.show');

Route::get('projects/{slug}/update/appearance', [ProjectController::class, 'updateAppearance'])
    ->name('projects.update.appearance');
