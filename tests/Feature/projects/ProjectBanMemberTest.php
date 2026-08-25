<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use App\Notifications\ProjectMemberBannedNotification;
use Illuminate\Support\Facades\Notification;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

function makeBanMember(Project $project, ProjectRole $role): User
{
    $user = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $user->id, 'role' => $role->value]);

    return $user;
}

test('an admin can ban a lower-ranked member and it notifies them', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $admin = makeBanMember($project, ProjectRole::ADMIN);
    $target = makeBanMember($project, ProjectRole::MEMBER);
    actingAs($admin);

    post(route('projects.update.member-ban', $project->slug), [
        'user_id' => $target->id,
    ])->assertRedirect();

    $this->assertDatabaseHas('members', [
        'project_id' => $project->id,
        'user_id' => $target->id,
        'role' => ProjectRole::BANNED->value,
    ]);

    Notification::assertSentTo($target, ProjectMemberBannedNotification::class);
});

test('a moderator can ban a lower-ranked member', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $moderator = makeBanMember($project, ProjectRole::MODERATOR);
    $target = makeBanMember($project, ProjectRole::MEMBER);
    actingAs($moderator);

    post(route('projects.update.member-ban', $project->slug), [
        'user_id' => $target->id,
    ])->assertRedirect();

    $this->assertDatabaseHas('members', [
        'project_id' => $project->id,
        'user_id' => $target->id,
        'role' => ProjectRole::BANNED->value,
    ]);
});

test('a moderator cannot ban another moderator or an admin', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $moderator = makeBanMember($project, ProjectRole::MODERATOR);
    $otherModerator = makeBanMember($project, ProjectRole::MODERATOR);
    $admin = makeBanMember($project, ProjectRole::ADMIN);
    actingAs($moderator);

    post(route('projects.update.member-ban', $project->slug), [
        'user_id' => $otherModerator->id,
    ])->assertForbidden();

    post(route('projects.update.member-ban', $project->slug), [
        'user_id' => $admin->id,
    ])->assertForbidden();
});

test('an admin cannot ban another admin', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $admin = makeBanMember($project, ProjectRole::ADMIN);
    $otherAdmin = makeBanMember($project, ProjectRole::ADMIN);
    actingAs($admin);

    post(route('projects.update.member-ban', $project->slug), [
        'user_id' => $otherAdmin->id,
    ])->assertForbidden();
});

test('the owner can ban any non-owner member, admins included', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $admin = makeBanMember($project, ProjectRole::ADMIN);
    actingAs($owner);

    post(route('projects.update.member-ban', $project->slug), [
        'user_id' => $admin->id,
    ])->assertRedirect();

    $this->assertDatabaseHas('members', [
        'project_id' => $project->id,
        'user_id' => $admin->id,
        'role' => ProjectRole::BANNED->value,
    ]);
});

test('nobody can ban the owner, including the owner themselves', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $admin = makeBanMember($project, ProjectRole::ADMIN);

    actingAs($admin);
    post(route('projects.update.member-ban', $project->slug), [
        'user_id' => $owner->id,
    ])->assertForbidden();

    actingAs($owner);
    post(route('projects.update.member-ban', $project->slug), [
        'user_id' => $owner->id,
    ])->assertForbidden();
});

test('nobody can ban themselves', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $admin = makeBanMember($project, ProjectRole::ADMIN);
    actingAs($admin);

    post(route('projects.update.member-ban', $project->slug), [
        'user_id' => $admin->id,
    ])->assertForbidden();
});

test('a plain member cannot ban anyone', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $member = makeBanMember($project, ProjectRole::MEMBER);
    $target = makeBanMember($project, ProjectRole::TASK_MANAGER);
    actingAs($member);

    post(route('projects.update.member-ban', $project->slug), [
        'user_id' => $target->id,
    ])->assertForbidden();
});

// Only for now
test('banning a non-member is forbidden', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $admin = makeBanMember($project, ProjectRole::ADMIN);
    $notAMember = User::factory()->create();
    actingAs($admin);

    post(route('projects.update.member-ban', $project->slug), [
        'user_id' => $notAMember->id,
    ])->assertForbidden();
});