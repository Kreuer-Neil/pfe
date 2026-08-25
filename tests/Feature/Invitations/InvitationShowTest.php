<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\ProjectInvitation;
use App\Models\User;

function makeMemberOf(Project $project, User $user, string $role = ProjectRole::MEMBER->value): Member
{
    return Member::updateOrCreate(
        ['user_id' => $user->id, 'project_id' => $project->id],
        ['role' => $role],
    );
}

test('a non-member cannot generate an invitation link', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    makeMemberOf($project, $owner, ProjectRole::ADMIN->value);

    $outsider = User::factory()->create();
    $this->actingAs($outsider);

    $this->get(route('projects.invitations.show', ['project_slug' => $project->slug]))
        ->assertForbidden();

    expect(ProjectInvitation::count())->toBe(0);
});

test('a member can generate an invitation link for a private project', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    makeMemberOf($project, $owner, ProjectRole::MEMBER->value);
    $this->actingAs($owner);

    $this->get(route('projects.invitations.show', ['project_slug' => $project->slug]))
        ->assertRedirect(route('projects.show', $project->slug));

    expect(ProjectInvitation::count())->toBe(1);
    expect(ProjectInvitation::first())
        ->project_id->toBe($project->id)
        ->max_uses->toBeNull()
        ->expires_at->toBeNull();
});

test('generating a link for a public project does not create an invitation', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => false]);
    makeMemberOf($project, $owner, ProjectRole::MEMBER->value);
    $this->actingAs($owner);

    $this->get(route('projects.invitations.show', ['project_slug' => $project->slug]))
        ->assertRedirect(route('projects.show', $project->slug));

    expect(ProjectInvitation::count())->toBe(0);
});

test('reuses an existing matching invitation instead of creating a duplicate', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    makeMemberOf($project, $owner, ProjectRole::MEMBER->value);
    $existing = $project->generateInvitation(null, null);
    $this->actingAs($owner);

    $this->get(route('projects.invitations.show', ['project_slug' => $project->slug]))
        ->assertRedirect(route('projects.show', $project->slug));

    expect(ProjectInvitation::count())->toBe(1)
        ->and(ProjectInvitation::first()->id)->toBe($existing->id);
});

test('does not reuse an invitation that has already been used', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    makeMemberOf($project, $owner, ProjectRole::MEMBER->value);
    $existing = $project->generateInvitation(null, null);
    $existing->recordUse();
    $this->actingAs($owner);

    $this->get(route('projects.invitations.show', ['project_slug' => $project->slug]))
        ->assertRedirect(route('projects.show', $project->slug));

    expect(ProjectInvitation::count())->toBe(2);
});

test('rejects an expiry date in the past', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    makeMemberOf($project, $owner, ProjectRole::MEMBER->value);
    $this->actingAs($owner);

    $this->get(route('projects.invitations.show', [
        'project_slug' => $project->slug,
        'expires_at_date' => now()->subDay()->toDateString(),
        'expires_at_time' => '10:00',
    ]))->assertSessionHasErrors('expires_at_date');

    expect(ProjectInvitation::count())->toBe(0);
});

test('rejects max_uses of zero', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    makeMemberOf($project, $owner, ProjectRole::MEMBER->value);
    $this->actingAs($owner);

    $this->get(route('projects.invitations.show', [
        'project_slug' => $project->slug,
        'max_uses' => 0,
    ]))->assertSessionHasErrors('max_uses');
});

test('rejects an expiry time given without a date', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    makeMemberOf($project, $owner, ProjectRole::MEMBER->value);
    $this->actingAs($owner);

    $this->get(route('projects.invitations.show', [
        'project_slug' => $project->slug,
        'expires_at_time' => '10:00',
    ]))->assertSessionHasErrors('expires_at_date');
});

test('a plain member cannot generate an invitation when allow_members_invitations is off', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $project->permissions()->update(['allow_members_invitations' => false]);
    $member = User::factory()->create();
    makeMemberOf($project, $member, ProjectRole::MEMBER->value);
    $this->actingAs($member);

    $this->get(route('projects.invitations.show', ['project_slug' => $project->slug]))
        ->assertForbidden();

    expect(ProjectInvitation::count())->toBe(0);
});

test('a moderator can still generate an invitation when allow_members_invitations is off', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $project->permissions()->update(['allow_members_invitations' => false]);
    $moderator = User::factory()->create();
    makeMemberOf($project, $moderator, ProjectRole::MODERATOR->value);
    $this->actingAs($moderator);

    $this->get(route('projects.invitations.show', ['project_slug' => $project->slug]))
        ->assertRedirect(route('projects.show', $project->slug));

    expect(ProjectInvitation::count())->toBe(1);
});

test('creates an invitation with a max_uses cap and an expiry', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    makeMemberOf($project, $owner, ProjectRole::MEMBER->value);
    $this->actingAs($owner);

    $date = now()->addWeek()->toDateString();
    $this->get(route('projects.invitations.show', [
        'project_slug' => $project->slug,
        'max_uses' => 5,
        'expires_at_date' => $date,
        'expires_at_time' => '14:30',
    ]))->assertRedirect(route('projects.show', $project->slug));

    $invitation = ProjectInvitation::first();
    expect($invitation->max_uses)->toBe(5)
        ->and($invitation->expires_at->format('Y-m-d H:i'))->toBe($date.' 14:30');
});
