<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectInvitationController;
use App\Http\Controllers\ProjectNewsController;
use App\Http\Controllers\ProjectPollController;
use Illuminate\Support\Facades\Route;

Route::get('projects', [ProjectController::class, 'index'])
    ->name('projects');

// Route::get('projects/search', [ProjectController::class, 'indexSearch'])
//    ->name('projects.search');

Route::get('projects/my-projects', [ProjectController::class, 'myProjects'])
    ->name('project.my-projects');

Route::get('projects/create', [ProjectController::class, 'create'])
    ->name('projects.create');

Route::post('projects/store', [ProjectController::class, 'store'])
    ->name('projects.store');

Route::get('projects/invitations', [ProjectInvitationController::class, 'index'])
    ->name('projects.invitations');

Route::get('projects/invitations/show', [ProjectInvitationController::class, 'show'])
    ->name('projects.invitations.show');

Route::post('projects/invitations/', [ProjectInvitationController::class, 'use'])
    ->name('projects.invitations.use');

Route::get('projects/{project}', [ProjectController::class, 'show'])
    ->name('projects.show')
    ->missing(fn () => abort(404, __('project_not_found')));

Route::get('projects/{project}/join', [ProjectController::class, 'join'])
    ->name('projects.join')
    ->missing(fn () => redirect()->back()->withErrors(['join' => __('validation.project_not_found')]));

Route::post('projects/{project}/follow', [ProjectController::class, 'follow'])
    ->name('projects.follow');
Route::delete('projects/{project}/unfollow', [ProjectController::class, 'unfollow'])
    ->name('projects.unfollow');

Route::get('projects/{project}/news', [ProjectNewsController::class, 'index'])
    ->name('projects.news.index');

Route::prefix('projects/{project}')->group(function () {
    // Settings pages: redirect back to the project on denial
    Route::middleware('project.settings:updateAppearance')->group(function () {
        Route::get('edit', [ProjectController::class, 'editGeneral'])
            ->name('projects.edit');
        Route::get('edit/members', [ProjectController::class, 'editMembers'])
            ->name('projects.edit.members');
    });

    Route::middleware('project.settings:update')->group(function () {
        Route::get('edit/permissions', [ProjectController::class, 'editPermissions'])
            ->name('projects.edit.permissions');
    });

    Route::middleware('can:updateAppearance,project')->group(function () {
        Route::patch('update/appearance', [ProjectController::class, 'updateAppearance'])
            ->name('projects.update.appearance');
    });

    Route::middleware('can:createNews,project')->group(function () {
        Route::post('news/store', [ProjectNewsController::class, 'store'])
            ->name('projects.news.store');
    });

    Route::middleware('can:createPoll,project')->group(function () {
        Route::post('polls/store', [ProjectPollController::class, 'store'])
            ->name('projects.polls.store');
    });

    Route::post('polls/{poll}/vote', [ProjectPollController::class, 'vote'])
        ->name('projects.polls.vote');

    Route::middleware('can:update,project')->group(function () {
        Route::patch('update/visibility', [ProjectController::class, 'updateVisibility'])
            ->name('projects.update.visibility');
        Route::patch('update/tags', [ProjectController::class, 'updateTags'])
            ->name('projects.update.tags');
        Route::patch('update/location', [ProjectController::class, 'updateLocation'])
            ->name('projects.update.location');
        Route::patch('update/permissions', [ProjectController::class, 'updatePermissions'])
            ->name('projects.update.permissions');
    });

    // Per-target dynamic authorizations.
    Route::patch('update/member-role', [ProjectController::class, 'updateMemberRole'])
        ->name('projects.update.member-role');
    Route::patch('update/member-ban', [ProjectController::class, 'banMember'])
        ->name('projects.update.member-ban');
    Route::delete('news/{news}/destroy', [ProjectNewsController::class, 'destroy'])
        ->name('projects.news.destroy');
    Route::delete('polls/{poll}/destroy', [ProjectPollController::class, 'destroy'])
        ->name('projects.polls.destroy');
});

Route::delete('projects/{project}/invitations/{invitation}/revoke', [ProjectInvitationController::class, 'revoke'])
    ->name('projects.invitations.revoke');
