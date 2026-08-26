<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\ProjectNews;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('a member can see all of their project\'s news', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $member = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $member->id, 'role' => ProjectRole::MEMBER->value]);
    ProjectNews::factory()->count(3)->create(['project_id' => $project->id, 'user_id' => $owner->id]);

    $this->actingAs($member)
        ->get(route('projects.news.index', $project->slug))
        ->assertInertia(fn (Assert $page) => $page
            ->where('project.slug', $project->slug)
            ->has('news', 3)
        );
});

test('a non-member can see all of a public project\'s news', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => false]);
    ProjectNews::factory()->count(2)->create(['project_id' => $project->id, 'user_id' => $owner->id]);
    $visitor = User::factory()->create();

    $this->actingAs($visitor)
        ->get(route('projects.news.index', $project->slug))
        ->assertInertia(fn (Assert $page) => $page->has('news', 2));
});

test('a non-member cannot see a private project\'s news', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id, 'is_private' => true]);
    $visitor = User::factory()->create();

    $this->actingAs($visitor)
        ->get(route('projects.news.index', $project->slug))
        ->assertNotFound();
});

test('can_create_news reflects the viewer\'s role', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $moderator = User::factory()->create();
    $member = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $moderator->id, 'role' => ProjectRole::MODERATOR->value]);
    Member::create(['project_id' => $project->id, 'user_id' => $member->id, 'role' => ProjectRole::MEMBER->value]);

    $this->actingAs($moderator)
        ->get(route('projects.news.index', $project->slug))
        ->assertInertia(fn (Assert $page) => $page->where('project.can_create_news', true));

    $this->actingAs($member)
        ->get(route('projects.news.index', $project->slug))
        ->assertInertia(fn (Assert $page) => $page->where('project.can_create_news', false));
});

test('newsNextPage is populated when there is more than one page of results', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    ProjectNews::factory()->count(11)->create(['project_id' => $project->id, 'user_id' => $owner->id]);

    $this->actingAs($owner)
        ->get(route('projects.news.index', $project->slug))
        ->assertInertia(fn (Assert $page) => $page
            ->has('news', 10)
            ->where('newsNextPage', 2)
        );
});