<?php

//TODO add admin auth or design middleware?
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function() {

    Route::get('design/dashboard', function () {
        return Inertia::render('design/dashboard');
    })->name('design.dashboard');

    Route::get('design/projects/project', function () {
        return Inertia::render('design/projects/show');
    })->name('design.projects.project');

});
