<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Participation;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->project = Project::factory()->create(['owner_id' => $this->owner->id, 'is_private' => false]);

    $this->memberUser = User::factory()->create();
    Member::create(['user_id' => $this->memberUser->id, 'project_id' => $this->project->id, 'role' => ProjectRole::MEMBER]);

    $this->task = Task::factory()->create([
        'project_id' => $this->project->id,
        'user_id' => $this->owner->id,
    ]);
});

test('a participating user can cancel their participation', function () {
    Participation::create(['task_id' => $this->task->id, 'user_id' => $this->memberUser->id]);
    $this->actingAs($this->memberUser);

    $this->delete(route('tasks.participate.destroy', $this->task->id))->assertRedirect();

    $this->assertDatabaseMissing('participations', [
        'task_id' => $this->task->id,
        'user_id' => $this->memberUser->id,
    ]);
});

test('a non-participating user gets no-op redirect when trying to cancel', function () {
    $this->actingAs($this->memberUser);

    $this->delete(route('tasks.participate.destroy', $this->task->id))->assertRedirect();

    $this->assertDatabaseCount('participations', 0);
});
