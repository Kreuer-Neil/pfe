<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

test('an admin can change another member\'s role', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $target = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $target->id, 'role' => ProjectRole::MEMBER->value]);
    actingAs($owner);

    post(route('projects.update.member-role', $project->slug), [
        'user_id' => $target->id,
        'role' => ProjectRole::MODERATOR->value,
    ])->assertRedirect();

    $this->assertDatabaseHas('members', [
        'project_id' => $project->id,
        'user_id' => $target->id,
        'role' => ProjectRole::MODERATOR->value,
    ]);
});

test('a moderator cannot change member roles (admin-only)', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $moderator = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $moderator->id, 'role' => ProjectRole::MODERATOR->value]);
    $target = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $target->id, 'role' => ProjectRole::MEMBER->value]);
    actingAs($moderator);

    post(route('projects.update.member-role', $project->slug), [
        'user_id' => $target->id,
        'role' => ProjectRole::TASK_MANAGER->value,
    ])->assertForbidden();
});

test('role cannot be set to viewer (not an assignable role)', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $target = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $target->id, 'role' => ProjectRole::MEMBER->value]);
    actingAs($owner);

    post(route('projects.update.member-role', $project->slug), [
        'user_id' => $target->id,
        'role' => 'viewer',
    ])->assertSessionHasErrors('role');
});

test('changing the role of a non-member fails', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $notAMember = User::factory()->create();
    actingAs($owner);

    post(route('projects.update.member-role', $project->slug), [
        'user_id' => $notAMember->id,
        'role' => ProjectRole::MODERATOR->value,
    ])->assertSessionHasErrors('role');
});
