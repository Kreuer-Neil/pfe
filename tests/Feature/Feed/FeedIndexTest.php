<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\ProjectFollow;
use App\Models\ProjectNews;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('feed includes news from a project the user is a member of', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $user = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $user->id, 'role' => ProjectRole::MEMBER->value]);
    $news = ProjectNews::factory()->create(['project_id' => $project->id, 'user_id' => $owner->id]);

    $this->actingAs($user)
        ->get(route('feed.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('news', 1)
            ->where('news.0.id', $news->id)
        );
});

test('feed includes news from a project the user explicitly follows but is not a member of', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => false]);
    $user = User::factory()->create();
    ProjectFollow::create(['user_id' => $user->id, 'project_id' => $project->id]);
    $news = ProjectNews::factory()->create(['project_id' => $project->id, 'user_id' => $owner->id]);

    $this->actingAs($user)
        ->get(route('feed.index'))
        ->assertInertia(fn (Assert $page) => $page->has('news', 1));
});

test('feed excludes news from unrelated projects', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    ProjectNews::factory()->create(['project_id' => $project->id, 'user_id' => $owner->id]);
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('feed.index'))
        ->assertInertia(fn (Assert $page) => $page->has('news', 0));
});

test('visiting the feed marks it visited, and a post created after the last visit is still unread', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $user = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $user->id, 'role' => ProjectRole::MEMBER->value]);
    $oldNews = ProjectNews::factory()->create(['project_id' => $project->id, 'user_id' => $owner->id]);

    expect($user->fresh()->hasUnreadFeedItems())->toBeTrue();

    $this->actingAs($user)->get(route('feed.index'));

    expect($user->fresh()->hasUnreadFeedItems())->toBeFalse();

    $this->travel(1)->seconds();
    $newNews = ProjectNews::factory()->create(['project_id' => $project->id, 'user_id' => $owner->id]);

    expect($user->fresh()->hasUnreadFeedItems())->toBeTrue();
});

test('newsNextPage is populated when there is more than one page of results', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $user = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $user->id, 'role' => ProjectRole::MEMBER->value]);
    ProjectNews::factory()->count(21)->create(['project_id' => $project->id, 'user_id' => $owner->id]);

    $this->actingAs($user)
        ->get(route('feed.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('news', 20)
            ->where('newsNextPage', 2)
        );
});
