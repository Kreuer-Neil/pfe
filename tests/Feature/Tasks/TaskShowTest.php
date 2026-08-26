<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

beforeEach(function () {
    $this->owner = User::factory()->create();
});

function makeTaskFor(Project $project, User $owner): Task
{
    return Task::factory()->create([
        'project_id' => $project->id,
        'user_id' => $owner->id,
    ]);
}

test('a project member can see a task on a private project', function () {
    $project = Project::factory()->create(['owner_id' => $this->owner->id, 'is_private' => true]);
    $task = makeTaskFor($project, $this->owner);

    $member = User::factory()->create();
    Member::create(['user_id' => $member->id, 'project_id' => $project->id, 'role' => ProjectRole::MEMBER]);

    $this->actingAs($member)
        ->get(route('tasks.show', $task->id))
        ->assertOk()
        ->assertJsonPath('task.id', $task->id);
});

test('a non-member cannot see a task on a private project', function () {
    $project = Project::factory()->create(['owner_id' => $this->owner->id, 'is_private' => true]);
    $task = makeTaskFor($project, $this->owner);

    $outsider = User::factory()->create();

    $this->actingAs($outsider)
        ->get(route('tasks.show', $task->id))
        ->assertNotFound();
});

test('a non-member can see a task on a public project', function () {
    $project = Project::factory()->create(['owner_id' => $this->owner->id, 'is_private' => false]);
    $task = makeTaskFor($project, $this->owner);

    $outsider = User::factory()->create();

    $this->actingAs($outsider)
        ->get(route('tasks.show', $task->id))
        ->assertOk()
        ->assertJsonPath('task.id', $task->id);
});

test('a member banned from a public project cannot see its tasks', function () {
    $project = Project::factory()->create(['owner_id' => $this->owner->id, 'is_private' => false]);
    $task = makeTaskFor($project, $this->owner);

    $banned = User::factory()->create();
    Member::create(['user_id' => $banned->id, 'project_id' => $project->id, 'role' => ProjectRole::BANNED]);

    $this->actingAs($banned)
        ->get(route('tasks.show', $task->id))
        ->assertNotFound();
});

test('a non-existent task 404s', function () {
    $this->actingAs($this->owner)
        ->get(route('tasks.show', 999999))
        ->assertNotFound();
});
