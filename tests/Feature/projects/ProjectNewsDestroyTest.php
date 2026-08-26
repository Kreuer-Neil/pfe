<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\ProjectNews;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\delete;

test('an admin can delete any news item in their project', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $author = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $author->id, 'role' => ProjectRole::MEMBER->value]);
    $news = ProjectNews::factory()->create(['project_id' => $project->id, 'user_id' => $author->id]);

    actingAs($owner);

    delete(route('projects.news.destroy', [$project->slug, $news->id]))->assertRedirect();

    $this->assertDatabaseMissing('project_news', ['id' => $news->id]);
});

test('a moderator can delete any news item in their project', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $moderator = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $moderator->id, 'role' => ProjectRole::MODERATOR->value]);
    $news = ProjectNews::factory()->create(['project_id' => $project->id, 'user_id' => $owner->id]);

    actingAs($moderator);

    delete(route('projects.news.destroy', [$project->slug, $news->id]))->assertRedirect();

    $this->assertDatabaseMissing('project_news', ['id' => $news->id]);
});

test('a news item author can delete their own item even as a plain member', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $author = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $author->id, 'role' => ProjectRole::MEMBER->value]);
    $news = ProjectNews::factory()->create(['project_id' => $project->id, 'user_id' => $author->id]);

    actingAs($author);

    delete(route('projects.news.destroy', [$project->slug, $news->id]))->assertRedirect();

    $this->assertDatabaseMissing('project_news', ['id' => $news->id]);
});

test('a different plain member cannot delete someone else\'s news item', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $author = User::factory()->create();
    $otherMember = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $author->id, 'role' => ProjectRole::MEMBER->value]);
    Member::create(['project_id' => $project->id, 'user_id' => $otherMember->id, 'role' => ProjectRole::MEMBER->value]);
    $news = ProjectNews::factory()->create(['project_id' => $project->id, 'user_id' => $author->id]);

    actingAs($otherMember);

    delete(route('projects.news.destroy', [$project->slug, $news->id]))->assertForbidden();

    $this->assertDatabaseHas('project_news', ['id' => $news->id]);
});

test('deleting via a project that does not own the news item 404s', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $otherProject = Project::factory()->create(['owner_id' => $owner->id]);
    $news = ProjectNews::factory()->create(['project_id' => $project->id, 'user_id' => $owner->id]);

    actingAs($owner);

    delete(route('projects.news.destroy', [$otherProject->slug, $news->id]))->assertNotFound();
});
