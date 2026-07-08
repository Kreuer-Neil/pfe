<?php

use App\Models\Project;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

test('creating a private project needs no location or tags', function () {
    actingAs(User::factory()->create());

    post(route('projects.store'), [
        'name' => 'A Private Project',
        'description' => 'A description long enough.',
        'is_private' => '1',
    ])->assertRedirect();

    $this->assertDatabaseHas('projects', ['name' => 'A Private Project', 'is_private' => true]);
});

test('creating a public project requires a resolvable location', function () {
    actingAs(User::factory()->create());

    post(route('projects.store'), [
        'name' => 'A Public Project',
        'description' => 'A description long enough.',
    ])->assertSessionHasErrors(['q', 'osm_id', 'osm_type']);

    $this->assertDatabaseMissing('projects', ['name' => 'A Public Project']);
});

test('creating a public project with a resolvable location succeeds', function () {
    actingAs(User::factory()->create());
    seedNominatimCache('Liège', '111', 'relation', 'Liège, Belgium');

    post(route('projects.store'), [
        'name' => 'A Located Project',
        'description' => 'A description long enough.',
        'q' => 'Liège',
        'osm_id' => '111',
        'osm_type' => 'relation',
        'tags' => ['nature'],
    ])->assertRedirect();

    $project = Project::where('name', 'A Located Project')->first();
    expect($project)->not->toBeNull();
    expect($project->location)->not->toBeNull();
    expect($project->location->display_name)->toBe('Liège, Belgium');
});

test('the project owner is automatically added as an admin member', function () {
    actingAs($user = User::factory()->create());

    post(route('projects.store'), [
        'name' => 'Owner Membership Project',
        'description' => 'A description long enough.',
        'is_private' => '1',
    ]);

    $project = Project::where('name', 'Owner Membership Project')->first();
    $this->assertDatabaseHas('members', [
        'project_id' => $project->id,
        'user_id' => $user->id,
        'role' => 'admin',
    ]);
});

test('project name must be unique', function () {
    actingAs(User::factory()->create());
    Project::factory()->create(['name' => 'Duplicate Name', 'owner_id' => User::factory()->create()->id]);

    post(route('projects.store'), [
        'name' => 'Duplicate Name',
        'description' => 'A description long enough.',
        'is_private' => '1',
    ])->assertSessionHasErrors('name');
});

// Was `required_if:is_private,true`, comparing against a string the frontend never actually
// sends (it sends is_private=1, like the location fields) - fixed to required_unless:is_private,1
// to match q/osm_id/osm_type's convention just above.
test('tags are required for public projects', function () {
    actingAs(User::factory()->create());
    seedNominatimCache('Liège', '222', 'relation', 'Liège, Belgium');

    post(route('projects.store'), [
        'name' => 'No Tags Public Project',
        'description' => 'A description long enough.',
        'q' => 'Liège',
        'osm_id' => '222',
        'osm_type' => 'relation',
    ])->assertSessionHasErrors('tags');

    $this->assertDatabaseMissing('projects', ['name' => 'No Tags Public Project']);
});

test('tags are not required for private projects', function () {
    actingAs(User::factory()->create());

    post(route('projects.store'), [
        'name' => 'Private No Tags Project',
        'description' => 'A description long enough.',
        'is_private' => 1,
    ])->assertRedirect();

    $this->assertDatabaseHas('projects', ['name' => 'Private No Tags Project']);
});
