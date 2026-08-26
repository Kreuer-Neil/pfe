<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\patch;

function makeMember(Project $project, ProjectRole $role): User
{
    $user = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $user->id, 'role' => $role->value]);

    return $user;
}

test('an admin can change another member\'s role', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $target = makeMember($project, ProjectRole::MEMBER);
    actingAs($owner);

    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $target->id,
        'role' => ProjectRole::MODERATOR->value,
    ])->assertRedirect();

    $this->assertDatabaseHas('members', [
        'project_id' => $project->id,
        'user_id' => $target->id,
        'role' => ProjectRole::MODERATOR->value,
    ]);
});

test('a moderator can change a lower-ranked member\'s role', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $moderator = makeMember($project, ProjectRole::MODERATOR);
    $target = makeMember($project, ProjectRole::MEMBER);
    actingAs($moderator);

    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $target->id,
        'role' => ProjectRole::TASK_MANAGER->value,
    ])->assertRedirect();

    $this->assertDatabaseHas('members', [
        'project_id' => $project->id,
        'user_id' => $target->id,
        'role' => ProjectRole::TASK_MANAGER->value,
    ]);
});

test('a moderator cannot change another moderator\'s role', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $moderator = makeMember($project, ProjectRole::MODERATOR);
    $target = makeMember($project, ProjectRole::MODERATOR);
    actingAs($moderator);

    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $target->id,
        'role' => ProjectRole::MEMBER->value,
    ])->assertForbidden();
});

test('a moderator cannot change an admin\'s role', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $moderator = makeMember($project, ProjectRole::MODERATOR);
    $admin = makeMember($project, ProjectRole::ADMIN);
    actingAs($moderator);

    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $admin->id,
        'role' => ProjectRole::MEMBER->value,
    ])->assertForbidden();
});

test('a moderator cannot elevate a member to moderator or admin', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $moderator = makeMember($project, ProjectRole::MODERATOR);
    $target = makeMember($project, ProjectRole::MEMBER);
    actingAs($moderator);

    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $target->id,
        'role' => ProjectRole::MODERATOR->value,
    ])->assertForbidden();

    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $target->id,
        'role' => ProjectRole::ADMIN->value,
    ])->assertForbidden();
});

test('an admin cannot change another admin\'s role or elevate to admin', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $admin = makeMember($project, ProjectRole::ADMIN);
    $otherAdmin = makeMember($project, ProjectRole::ADMIN);
    $target = makeMember($project, ProjectRole::MEMBER);
    actingAs($admin);

    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $otherAdmin->id,
        'role' => ProjectRole::MEMBER->value,
    ])->assertForbidden();

    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $target->id,
        'role' => ProjectRole::ADMIN->value,
    ])->assertForbidden();
});

test('the owner can change any non-owner member\'s role, including elevating to admin', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $admin = makeMember($project, ProjectRole::ADMIN);
    actingAs($owner);

    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $admin->id,
        'role' => ProjectRole::MEMBER->value,
    ])->assertRedirect();

    $this->assertDatabaseHas('members', [
        'project_id' => $project->id,
        'user_id' => $admin->id,
        'role' => ProjectRole::MEMBER->value,
    ]);
});

test('nobody can change the owner\'s role, including the owner themselves', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $admin = makeMember($project, ProjectRole::ADMIN);

    actingAs($owner);
    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $owner->id,
        'role' => ProjectRole::MEMBER->value,
    ])->assertForbidden();

    actingAs($admin);
    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $owner->id,
        'role' => ProjectRole::MEMBER->value,
    ])->assertForbidden();
});

test('nobody can change their own role', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $admin = makeMember($project, ProjectRole::ADMIN);
    actingAs($admin);

    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $admin->id,
        'role' => ProjectRole::MEMBER->value,
    ])->assertForbidden();
});

test('role cannot be set to viewer (not an assignable role)', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $target = makeMember($project, ProjectRole::MEMBER);
    actingAs($owner);

    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $target->id,
        'role' => 'viewer',
    ])->assertSessionHasErrors('role');
});

test('role cannot be set to banned via this endpoint (banning has its own action)', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $target = makeMember($project, ProjectRole::MEMBER);
    actingAs($owner);

    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $target->id,
        'role' => ProjectRole::BANNED->value,
    ])->assertSessionHasErrors('role');
});

test('changing the role of a non-member is forbidden', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $notAMember = User::factory()->create();
    actingAs($owner);

    patch(route('projects.update.member-role', $project->slug), [
        'user_id' => $notAMember->id,
        'role' => ProjectRole::MODERATOR->value,
    ])->assertForbidden();
});