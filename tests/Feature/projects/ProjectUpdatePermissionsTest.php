<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

// Controller uses $request->has('allow_members_invitations'), native-checkbox semantics: the
// key must be entirely absent to mean "off", not present-with-falsy-value.

test('a permissions row is created automatically with a new project, allowing invitations by default', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $this->assertDatabaseHas('project_permissions', [
        'project_id' => $project->id,
        'allow_members_invitations' => true,
    ]);
});

test('an admin can turn off allow_members_invitations', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    actingAs($owner);

    post(route('projects.update.permissions', $project->slug), [])
        ->assertRedirect(route('projects.edit.permissions', $project->slug));

    $this->assertDatabaseHas('project_permissions', [
        'project_id' => $project->id,
        'allow_members_invitations' => false,
    ]);
});

test('a moderator cannot update permissions (admin-only)', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $moderator = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $moderator->id, 'role' => ProjectRole::MODERATOR->value]);
    actingAs($moderator);

    post(route('projects.update.permissions', $project->slug), [])
        ->assertForbidden();
});

test('the permissions settings page is admin-only, unlike general/members', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $moderator = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $moderator->id, 'role' => ProjectRole::MODERATOR->value]);
    actingAs($moderator);

    get(route('projects.edit.permissions', $project->slug))
        ->assertRedirect(route('projects.show', $project->slug));
});
