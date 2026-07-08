<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;

function memberOfProject(Project $project, User $user, string $role): Member
{
    return Member::create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'role' => $role,
    ]);
}

test('a plain member cannot revoke an invitation', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $invitation = $project->generateInvitation(null, null);

    $member = User::factory()->create();
    memberOfProject($project, $member, ProjectRole::MEMBER->value);
    $this->actingAs($member);

    $this->post(route('projects.invitations.revoke', [$project->slug, $invitation->id]))
        ->assertForbidden();

    expect($invitation->fresh()->isValid())->toBeTrue();
});

test('a task manager cannot revoke an invitation', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $invitation = $project->generateInvitation(null, null);

    $taskManager = User::factory()->create();
    memberOfProject($project, $taskManager, ProjectRole::TASK_MANAGER->value);
    $this->actingAs($taskManager);

    $this->post(route('projects.invitations.revoke', [$project->slug, $invitation->id]))
        ->assertForbidden();
});

test('an admin can revoke an invitation', function () {
    $admin = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $admin->id, 'is_private' => true]);
    memberOfProject($project, $admin, ProjectRole::ADMIN->value);
    $invitation = $project->generateInvitation(null, null);
    $this->actingAs($admin);

    $this->post(route('projects.invitations.revoke', [$project->slug, $invitation->id]))
        ->assertRedirect();

    expect($invitation->fresh()->isValid())->toBeFalse();
});

test('a moderator can revoke an invitation', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $invitation = $project->generateInvitation(null, null);

    $moderator = User::factory()->create();
    memberOfProject($project, $moderator, ProjectRole::MODERATOR->value);
    $this->actingAs($moderator);

    $this->post(route('projects.invitations.revoke', [$project->slug, $invitation->id]))
        ->assertRedirect();

    expect($invitation->fresh()->isValid())->toBeFalse();
});

test('an admin of one project cannot revoke an invitation belonging to another project', function () {
    $adminA = User::factory()->create();
    $projectA = Project::factory()->create(['owner_id' => $adminA->id, 'is_private' => true]);
    memberOfProject($projectA, $adminA, ProjectRole::ADMIN->value);

    $ownerB = User::factory()->create();
    $projectB = Project::factory()->create(['owner_id' => $ownerB->id, 'is_private' => true]);
    $invitationB = $projectB->generateInvitation(null, null);

    $this->actingAs($adminA);

    $this->post(route('projects.invitations.revoke', [$projectA->slug, $invitationB->id]))
        ->assertNotFound();

    expect($invitationB->fresh()->isValid())->toBeTrue();
});
