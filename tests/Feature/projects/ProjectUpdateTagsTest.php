<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\Tag;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\patch;

test('an admin can sync project tags', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    actingAs($owner);

    patch(route('projects.update.tags', $project->slug), [
        'tags' => ['nature', 'insects'],
    ])->assertRedirect(route('projects.edit', $project->slug));

    $tagNames = $project->fresh()->tags()->pluck('name')->all();
    expect($tagNames)->toEqualCanonicalizing(['nature', 'insects']);
});

test('a moderator cannot update project tags (admin-only)', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $moderator = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $moderator->id, 'role' => ProjectRole::MODERATOR->value]);
    actingAs($moderator);

    patch(route('projects.update.tags', $project->slug), [
        'tags' => ['nature'],
    ])->assertForbidden();
});

test('tags must exist in the tags table', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    actingAs($owner);

    patch(route('projects.update.tags', $project->slug), [
        'tags' => ['not-a-real-tag'],
    ])->assertSessionHasErrors('tags.0');
});

test('at least one tag is required if project is public', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => false]);
    actingAs($owner);

    patch(route('projects.update.tags', $project->slug), [])
        ->assertSessionHasErrors('tags');
});

test('no tag is required if project is private', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    actingAs($owner);

    patch(route('projects.update.tags', $project->slug), [])
        ->assertSessionHasNoErrors();
    // TODO Also assert if tags updated to empty
});

test('at most 7 tags are allowed', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    actingAs($owner);

    $tags = Tag::query()->limit(8)->pluck('name')->all();
    expect(count($tags))->toBeGreaterThanOrEqual(8);

    patch(route('projects.update.tags', $project->slug), [
        'tags' => $tags,
    ])->assertSessionHasErrors('tags');
});
