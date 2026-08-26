<?php

use App\Enums\ProjectRole;
use App\Models\Location;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\patch;

// Controller uses $request->has('is_private'), native-checkbox semantics: the key must be
// entirely absent to mean "not private", not present-with-falsy-value. Sending is_private=0
// still counts as private, since the key is present.

test('an admin can make a located project public', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create([
        'owner_id' => $owner->id,
        'is_private' => true,
        'location_id' => Location::factory(),
    ]);
    actingAs($owner);

    patch(route('projects.update.visibility', $project->slug), [])
        ->assertRedirect(route('projects.edit', $project->slug));

    $this->assertDatabaseHas('projects', ['id' => $project->id, 'is_private' => false]);
});

test('a project cannot be made public without a location', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create([
        'owner_id' => $owner->id,
        'is_private' => true,
        'location_id' => null,
    ]);
    actingAs($owner);

    patch(route('projects.update.visibility', $project->slug), [])
        ->assertSessionHasErrors('is_private');

    $this->assertDatabaseHas('projects', ['id' => $project->id, 'is_private' => true]);
});

test('an admin can make a project private regardless of location', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create([
        'owner_id' => $owner->id,
        'is_private' => false,
        'location_id' => null,
    ]);
    actingAs($owner);

    patch(route('projects.update.visibility', $project->slug), [
        'is_private' => '1',
    ])->assertRedirect();

    $this->assertDatabaseHas('projects', ['id' => $project->id, 'is_private' => true]);
});

test('a moderator cannot update visibility (admin-only, unlike appearance)', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $moderator = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $moderator->id, 'role' => ProjectRole::MODERATOR->value]);
    actingAs($moderator);

    patch(route('projects.update.visibility', $project->slug), [])
        ->assertForbidden();
});
