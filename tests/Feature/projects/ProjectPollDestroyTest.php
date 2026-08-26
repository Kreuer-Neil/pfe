<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\PollChoice;
use App\Models\Project;
use App\Models\ProjectPoll;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\delete;

function makePollForDestroy(User $author, Project $project): ProjectPoll
{
    $poll = ProjectPoll::factory()->create(['project_id' => $project->id, 'user_id' => $author->id]);
    PollChoice::factory()->count(2)->create(['project_poll_id' => $poll->id]);

    return $poll;
}

test('an admin can delete any poll in their project', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $author = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $author->id, 'role' => ProjectRole::TASK_MANAGER->value]);
    $poll = makePollForDestroy($author, $project);

    actingAs($owner);

    delete(route('projects.polls.destroy', [$project->slug, $poll->id]))->assertRedirect();

    $this->assertDatabaseMissing('project_polls', ['id' => $poll->id]);
});

test('a moderator can delete any poll in their project', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $moderator = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $moderator->id, 'role' => ProjectRole::MODERATOR->value]);
    $poll = makePollForDestroy($owner, $project);

    actingAs($moderator);

    delete(route('projects.polls.destroy', [$project->slug, $poll->id]))->assertRedirect();

    $this->assertDatabaseMissing('project_polls', ['id' => $poll->id]);
});

test('a poll author can delete their own poll even as a task manager', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $author = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $author->id, 'role' => ProjectRole::TASK_MANAGER->value]);
    $poll = makePollForDestroy($author, $project);

    actingAs($author);

    delete(route('projects.polls.destroy', [$project->slug, $poll->id]))->assertRedirect();

    $this->assertDatabaseMissing('project_polls', ['id' => $poll->id]);
});

test('a different task manager cannot delete someone else\'s poll', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $author = User::factory()->create();
    $otherTaskManager = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $author->id, 'role' => ProjectRole::TASK_MANAGER->value]);
    Member::create(['project_id' => $project->id, 'user_id' => $otherTaskManager->id, 'role' => ProjectRole::TASK_MANAGER->value]);
    $poll = makePollForDestroy($author, $project);

    actingAs($otherTaskManager);

    delete(route('projects.polls.destroy', [$project->slug, $poll->id]))->assertForbidden();

    $this->assertDatabaseHas('project_polls', ['id' => $poll->id]);
});

test('deleting a poll cascades to its choices and participations', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $voter = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $voter->id, 'role' => ProjectRole::MEMBER->value]);
    $poll = makePollForDestroy($owner, $project);
    $choice = $poll->choices()->first();
    $poll->vote($voter, [$choice->id]);

    actingAs($owner);

    delete(route('projects.polls.destroy', [$project->slug, $poll->id]))->assertRedirect();

    $this->assertDatabaseMissing('poll_choices', ['project_poll_id' => $poll->id]);
    $this->assertDatabaseMissing('poll_participations', ['project_poll_id' => $poll->id]);
});

test('deleting via a project that does not own the poll 404s', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $otherProject = Project::factory()->create(['owner_id' => $owner->id]);
    $poll = makePollForDestroy($owner, $project);

    actingAs($owner);

    delete(route('projects.polls.destroy', [$otherProject->slug, $poll->id]))->assertNotFound();
});
