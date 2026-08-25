<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\ProjectNews;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('dashboard feedNews reflects the membership union follow project set, capped at 5', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $user = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $user->id, 'role' => ProjectRole::MEMBER->value]);
    ProjectNews::factory()->count(7)->create(['project_id' => $project->id, 'user_id' => $owner->id]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->has('feedNews', 5));
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
