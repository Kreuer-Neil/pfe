<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;

test('rejects a code that is not 16 characters', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('projects.invitations.use'), ['code' => 'short'])
        ->assertSessionHasErrors('code');
});

test('rejects an unknown code', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('projects.invitations.use'), ['code' => str_repeat('a', 16)])
        ->assertSessionHasErrors('code');
});

test('rejects an expired invitation', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $invitation = $project->generateInvitation(now()->subDay()->toDateTimeString(), null);

    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('projects.invitations.use'), ['code' => $invitation->code, 'confirm' => 1])
        ->assertSessionHasErrors('code');

    expect(Member::where(['user_id' => $user->id, 'project_id' => $project->id])->exists())->toBeFalse();
});

test('rejects an exhausted (max_uses reached) invitation', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $invitation = $project->generateInvitation(null, 1);
    $invitation->recordUse(); // exhausts it (max_uses=1)

    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('projects.invitations.use'), ['code' => $invitation->code, 'confirm' => 1])
        ->assertSessionHasErrors('code');

    expect($invitation->fresh()->isValid())->toBeFalse()
        ->and(Member::where(['user_id' => $user->id, 'project_id' => $project->id])->exists())->toBeFalse();
});

test('rejects joining a project the user already belongs to', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $invitation = $project->generateInvitation(null, null);

    $user = User::factory()->create();
    Member::create(['user_id' => $user->id, 'project_id' => $project->id, 'role' => ProjectRole::MEMBER->value]);
    $this->actingAs($user);

    $this->post(route('projects.invitations.use'), ['code' => $invitation->code, 'confirm' => 1])
        ->assertSessionHasErrors('code');
});

test('a first request without confirm only prompts, without creating membership', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $invitation = $project->generateInvitation(null, null);

    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('projects.invitations.use'), ['code' => $invitation->code])
        ->assertSessionHasNoErrors();

    expect(Member::where(['user_id' => $user->id, 'project_id' => $project->id])->exists())->toBeFalse()
        ->and($invitation->fresh()->used_count)->toBe(0);
});

test('confirming joins the project, increments used_count, and redirects to the project', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $invitation = $project->generateInvitation(null, null);

    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('projects.invitations.use'), ['code' => $invitation->code, 'confirm' => 1])
        ->assertRedirect(route('projects.show', $project->slug));

    $member = Member::where(['user_id' => $user->id, 'project_id' => $project->id])->first();
    expect($member)->not->toBeNull()
        ->and($member->role)->toBe(ProjectRole::MEMBER->value)
        ->and($invitation->fresh()->used_count)->toBe(1);
});

test('reaching max_uses on the final confirmed use auto-revokes the invitation', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $invitation = $project->generateInvitation(null, 1);

    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('projects.invitations.use'), ['code' => $invitation->code, 'confirm' => 1])
        ->assertRedirect(route('projects.show', $project->slug));

    $invitation->refresh();
    expect($invitation->used_count)->toBe(1)
        ->and($invitation->isValid())->toBeFalse()
        ->and($invitation->expires_at)->not->toBeNull();

    // A second user trying the now-exhausted code should be rejected.
    $secondUser = User::factory()->create();
    $this->actingAs($secondUser);

    $this->post(route('projects.invitations.use'), ['code' => $invitation->code, 'confirm' => 1])
        ->assertSessionHasErrors('code');

    expect(Member::where(['user_id' => $secondUser->id, 'project_id' => $project->id])->exists())->toBeFalse();
});
