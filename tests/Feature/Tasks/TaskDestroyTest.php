<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->project = Project::factory()->create(['owner_id' => $this->owner->id, 'is_private' => false]);
    // Owner's membership is auto-created as admin - downgrade to member here to prove
    // task deletion is ownership-based, not only role-based.
    Member::where(['user_id' => $this->owner->id, 'project_id' => $this->project->id])
        ->update(['role' => ProjectRole::MEMBER]);

    $this->moderatorUser = User::factory()->create();
    Member::create(['user_id' => $this->moderatorUser->id, 'project_id' => $this->project->id, 'role' => ProjectRole::MODERATOR]);

    $this->memberUser = User::factory()->create();
    Member::create(['user_id' => $this->memberUser->id, 'project_id' => $this->project->id, 'role' => ProjectRole::MEMBER]);

    $this->task = Task::factory()->create([
        'project_id' => $this->project->id,
        'user_id' => $this->owner->id,
    ]);
});

test('the task owner can delete their task', function () {
    $this->actingAs($this->owner);

    $this->post(route('tasks.destroy', $this->task->id))->assertRedirect();

    $this->assertSoftDeleted('tasks', ['id' => $this->task->id]);
});

test('a project moderator can delete a task they do not own', function () {
    $this->actingAs($this->moderatorUser);

    $this->post(route('tasks.destroy', $this->task->id))->assertRedirect();

    $this->assertSoftDeleted('tasks', ['id' => $this->task->id]);
});

test('a plain member who is neither owner nor moderator/admin cannot delete the task', function () {
    $this->actingAs($this->memberUser);

    $this->post(route('tasks.destroy', $this->task->id))->assertForbidden();

    $this->assertDatabaseHas('tasks', ['id' => $this->task->id, 'deleted_at' => null]);
});

test('deleting a non-existent task 404s', function () {
    $this->actingAs($this->owner);

    $this->post(route('tasks.destroy', 999999))->assertNotFound();
});
