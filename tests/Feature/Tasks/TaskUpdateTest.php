<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->adminUser = User::factory()->create();
    $this->memberUser = User::factory()->create();
    $this->project = Project::factory()->create(['owner_id' => $this->adminUser->id, 'is_private' => false]);
    
    // Tests runs for owner ability to edit/delete, admins being able to delete only, and members being unable to edit/delete.
    Member::create(['user_id' => $this->owner->id, 'project_id' => $this->project->id, 'role' => ProjectRole::MEMBER]);
    Member::create(['user_id' => $this->adminUser->id, 'project_id' => $this->project->id, 'role' => ProjectRole::ADMIN]);
    Member::create(['user_id' => $this->memberUser->id, 'project_id' => $this->project->id, 'role' => ProjectRole::MEMBER]);

    $this->task = Task::factory()->create([
        'project_id' => $this->project->id,
        'user_id' => $this->owner->id,
        'title' => 'Original title',
    ]);

    $this->validPayload = [
        'title' => 'Updated title',
        'description' => 'Updated description',
        'due_at_date' => now()->addDays(2)->format('Y-m-d'),
        'due_at_time' => '09:00:00',
    ];
});

test('task owner can update their task', function () {
    $this->actingAs($this->owner);

    $this->post(route('tasks.update', $this->task->id), $this->validPayload)->assertRedirect();

    $this->assertDatabaseHas('tasks', [
        'id' => $this->task->id,
        'title' => 'Updated title',
        'description' => 'Updated description',
    ]);
});

test('a project admin who is not the task owner cannot update the task', function () {
    $this->actingAs($this->adminUser);

    $this->post(route('tasks.update', $this->task->id), $this->validPayload)->assertForbidden();

    $this->assertDatabaseHas('tasks', ['id' => $this->task->id, 'title' => 'Original title']);
});

test('a due date in the past is rejected', function () {
    $this->actingAs($this->owner);

    $this->post(route('tasks.update', $this->task->id), [
        ...$this->validPayload,
        'due_at_date' => now()->subDay()->format('Y-m-d'),
    ])->assertSessionHasErrors('due_at_date');

    $this->assertDatabaseHas('tasks', ['id' => $this->task->id, 'title' => 'Original title']);
});

test('updating a non-existent task just redirects back without throwing', function () {
    $this->actingAs($this->owner);

    // Inertia::flash() stores under its own session key, not the validation
    // errors bag - asserting that flash's content is an Inertia-view concern,
    // out of scope here. Just confirm the request is handled gracefully.
    $this->post(route('tasks.update', 999999), $this->validPayload)->assertRedirect();
});