<?php

use App\Enums\ProjectRole;
use App\Models\Location;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\patch;

test('an admin can set a location on a private project', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true, 'location_id' => null]);
    actingAs($owner);
    seedNominatimCache('Namur', '333', 'relation', 'Namur, Belgium');

    patch(route('projects.update.location', $project->slug), [
        'q' => 'Namur',
        'osm_id' => '333',
        'osm_type' => 'relation',
    ])->assertRedirect(route('projects.edit', $project->slug));

    expect($project->fresh()->location?->display_name)->toBe('Namur, Belgium');
});

test('an admin can clear the location on a private project', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create([
        'owner_id' => $owner->id,
        'is_private' => true,
        'location_id' => Location::factory(),
    ]);
    actingAs($owner);

    patch(route('projects.update.location', $project->slug), [])
        ->assertRedirect(route('projects.edit', $project->slug));

    expect($project->fresh()->location_id)->toBeNull();
});

test('a public project cannot have its location cleared', function () {
    $owner = User::factory()->create();
    $location = Location::factory()->create();
    $project = Project::factory()->create([
        'owner_id' => $owner->id,
        'is_private' => false,
        'location_id' => $location->id,
    ]);
    actingAs($owner);

    patch(route('projects.update.location', $project->slug), [])
        ->assertSessionHasErrors(['q', 'osm_id', 'osm_type']);

    expect($project->fresh()->location_id)->toBe($location->id);
});

test('an unresolvable location fails validation', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    actingAs($owner);
    // resolveFromSearchCache() retries live once if the cache has no match (in case it
    // expired between search and store) - fake the HTTP call so that retry can't reach
    // the real Nominatim network even though the initial cache lookup also misses.
    Cache::put('nominatim_' . md5('Nowhere'), [], now()->addDay());
    Http::fake(['nominatim.openstreetmap.org/*' => Http::response([])]);

    patch(route('projects.update.location', $project->slug), [
        'q' => 'Nowhere',
        'osm_id' => 'does-not-exist',
        'osm_type' => 'relation',
    ])->assertSessionHasErrors('osm_id');
});

test('a moderator cannot update project location (admin-only)', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $moderator = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $moderator->id, 'role' => ProjectRole::MODERATOR->value]);
    actingAs($moderator);

    patch(route('projects.update.location', $project->slug), [])
        ->assertForbidden();
});
