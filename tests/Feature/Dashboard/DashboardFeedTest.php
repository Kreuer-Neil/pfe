<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\PollChoice;
use App\Models\Project;
use App\Models\ProjectNews;
use App\Models\ProjectPoll;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('dashboard feedItems reflects the membership union follow project set, capped at 5', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $user = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $user->id, 'role' => ProjectRole::MEMBER->value]);
    ProjectNews::factory()->count(7)->create(['project_id' => $project->id, 'user_id' => $owner->id]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->has('feedItems', 5));
});

test('a poll the user has not voted on or skipped shows up in the dashboard feed', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $user = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $user->id, 'role' => ProjectRole::MEMBER->value]);
    $poll = ProjectPoll::factory()->create(['project_id' => $project->id, 'user_id' => $owner->id]);
    PollChoice::factory()->count(2)->create(['project_poll_id' => $poll->id]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('feedItems', 1)
            ->where('feedItems.0.type', 'poll')
        );
});

test('a poll the user already voted on or skipped is dropped from the dashboard feed', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $user = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $user->id, 'role' => ProjectRole::MEMBER->value]);
    $poll = ProjectPoll::factory()->create(['project_id' => $project->id, 'user_id' => $owner->id]);
    $choice = PollChoice::factory()->create(['project_poll_id' => $poll->id]);
    $poll->vote($user, [$choice->id]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->has('feedItems', 0));
});

test('an expired poll is dropped from the dashboard feed regardless of participation', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $user = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $user->id, 'role' => ProjectRole::MEMBER->value]);
    $poll = ProjectPoll::factory()->create(['project_id' => $project->id, 'user_id' => $owner->id, 'end_date' => now()->subDay()]);
    PollChoice::factory()->count(2)->create(['project_poll_id' => $poll->id]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->has('feedItems', 0));
});

test('dashboardFeedHidden reflects the user preference', function () {
    $user = User::factory()->create();
    $user->preferences->update(['dashboard_feed_hidden' => true]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('dashboardFeedHidden', true));
});

test('dashboardFeedHidden defaults to false', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('dashboardFeedHidden', false));
});
