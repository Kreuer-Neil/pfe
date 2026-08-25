<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\ProjectFollow;
use App\Models\User;

test('a user can follow a public project they are not a member of', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => false]);
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('projects.follow', $project->slug));

    $response->assertRedirect(route('projects.show', $project->slug));
    $this->assertDatabaseHas('project_follows', [
        'user_id' => $user->id,
        'project_id' => $project->id,
    ]);
});

test('following the same project twice does not create a duplicate row', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => false]);
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('projects.follow', $project->slug));
    $this->actingAs($user)->get(route('projects.follow', $project->slug));

    expect(ProjectFollow::where('user_id', $user->id)->where('project_id', $project->id)->count())->toBe(1);
});

test('a project member following their own project is a no-op', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => false]);
    $member = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $member->id, 'role' => ProjectRole::MEMBER->value]);

    $this->actingAs($member)->get(route('projects.follow', $project->slug));

    $this->assertDatabaseMissing('project_follows', [
        'user_id' => $member->id,
        'project_id' => $project->id,
    ]);
});

test('a user can unfollow a project they follow', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => false]);
    $user = User::factory()->create();
    ProjectFollow::create(['user_id' => $user->id, 'project_id' => $project->id]);

    $response = $this->actingAs($user)->get(route('projects.unfollow', $project->slug));

    $response->assertRedirect(route('projects.show', $project->slug));
    $this->assertDatabaseMissing('project_follows', [
        'user_id' => $user->id,
        'project_id' => $project->id,
    ]);
});

test('unfollowing a project not followed is a no-op', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => false]);
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('projects.unfollow', $project->slug));

    $response->assertRedirect(route('projects.show', $project->slug));
    $this->assertDatabaseMissing('project_follows', [
        'user_id' => $user->id,
        'project_id' => $project->id,
    ]);
});
