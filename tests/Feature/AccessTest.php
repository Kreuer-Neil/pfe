<?php

use App\Models\Project;
use App\Models\User;

beforeEach(function () {
    $this->actingAs($this->user = User::factory()->create());
});

test('guests are redirected to the login page', function () {
    $this->actingAsGuest();
    $this->get(route('dashboard'))->assertRedirect(route('login'));
    $this->get(route('projects'))->assertRedirect(route('login'));
    $this->get(route('projects'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->get(route('dashboard'))->assertOk();
});

test('authenticated users can visit the projects search page', function () {
    $this->get(route('projects'))->assertOk();
});

test('authenticated users can visit their projects', function () {
    $project = Project::factory()
        ->create([
            'owner_id' => $this->user->id,
            'is_private' => false
        ]);
    $project->joinAsMember($this->user);

    $this->get(route('projects.show', $project->id))->assertOk();
});

test('authenticated users can visit public projects they aren\'t part of', function () {
    $user = User::factory()->create();
    $project = Project::factory()
        ->create([
            'owner_id' => $user->id,
            'is_private' => false
        ]);

    $this->get(route('projects.show', $project->id))->assertOk();
});

test('authenticated users cannot visit private projects they aren\'t part of', function () {
    $user = User::factory()->create();
    $project = Project::factory()
        ->create([
            'owner_id' => $user->id,
            'is_private' => true
        ]);

    $this->get(route('projects.show', $project->slug))->assertNotFound();
});

test('authenticated users cannot go to the project search page and are redirected to projects index', function () {
    $this->get(route('projects.search'))
        ->assertRedirect(route('projects'));
});
