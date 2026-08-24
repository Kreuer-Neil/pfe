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
        'validated_at' => null,
    ]);
});

test('a participating user can validate the task', function () {
    Participation::create(['task_id' => $this->task->id, 'user_id' => $this->memberUser->id]);
    $this->actingAs($this->memberUser);

    $this->post(route('tasks.validate', $this->task->id))->assertRedirect();

    $this->assertNotNull($this->task->fresh()->validated_at);
});

test('a non-participating user cannot validate the task', function () {
    $this->actingAs($this->memberUser);

    $this->post(route('tasks.validate', $this->task->id))->assertForbidden();

    $this->assertNull($this->task->fresh()->validated_at);
});

test('validating a non-existent task redirects with an error instead of a hard failure', function () {
    $this->actingAs($this->memberUser);

    $this->post(route('tasks.validate', 999999))->assertRedirect();
});
