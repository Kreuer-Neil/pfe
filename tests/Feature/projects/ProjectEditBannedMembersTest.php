<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

test('the settings page splits banned members out of the regular members list', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $activeMember = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $activeMember->id, 'role' => ProjectRole::MEMBER->value]);
    $bannedMember = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $bannedMember->id, 'role' => ProjectRole::BANNED->value]);
    actingAs($owner);

    get(route('projects.edit', $project->slug))
        ->assertInertia(fn(Assert $page) => $page
            // owner + active member, banned member excluded
            ->has('project.members', 2)
            ->has('project.banned_members', 1)
            ->where('project.banned_members.0.id', $bannedMember->id)
            ->where('project.banned_members.0.role', ProjectRole::BANNED->value)
        );
});

test('an admin can unban a member by changing their role away from banned', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $bannedMember = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $bannedMember->id, 'role' => ProjectRole::BANNED->value]);
    actingAs($owner);

    post(route('projects.update.member-role', $project->slug), [
        'user_id' => $bannedMember->id,
        'role' => ProjectRole::MEMBER->value,
    ])->assertRedirect();

    $this->assertDatabaseHas('members', [
        'project_id' => $project->id,
        'user_id' => $bannedMember->id,
        'role' => ProjectRole::MEMBER->value,
    ]);
});