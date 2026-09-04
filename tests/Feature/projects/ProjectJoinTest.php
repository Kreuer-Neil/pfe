<?php

use App\Models\Project;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

test('a user can join a public project', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => false]);
    $user = User::factory()->create();
    actingAs($user);

    get(route('projects.join', $project->slug))
        ->assertRedirect(route('projects.show', $project->slug));

    $this->assertDatabaseHas('members', [
        'project_id' => $project->id,
        'user_id' => $user->id,
    ]);
});

test('a user cannot join a private project via the join route', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $user = User::factory()->create();
    actingAs($user);

    get(route('projects.join', $project->slug))
        ->assertForbidden();

    $this->assertDatabaseMissing('members', [
        'project_id' => $project->id,
        'user_id' => $user->id,
    ]);
});

test('joining a project that does not exist redirects back with an error', function () {
    actingAs(User::factory()->create());

    get(route('projects.join', 'does-not-exist'))->assertRedirect();
});
