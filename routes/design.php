<?php

//TODO add admin auth
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function() {

    Route::get('design/dashboard', function () {
        return Inertia::render('design/dashboard');
    })->name('design.dashboard');
});
