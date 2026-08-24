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

    $this->externalUser = User::factory()->create();

    $this->task = Task::factory()->create([
        'project_id' => $this->project->id,
        'user_id' => $this->owner->id,
        'min_participations' => 5,
    ]);
});

test('a project member can participate in a task', function () {
    $this->actingAs($this->memberUser);

    $this->post(route('tasks.participate', $this->task->id))->assertRedirect();

    $this->assertDatabaseHas('participations', [
        'task_id' => $this->task->id,
        'user_id' => $this->memberUser->id,
    ]);
});

test('a member already participating cannot participate again', function () {
    Participation::create(['task_id' => $this->task->id, 'user_id' => $this->memberUser->id]);

    $this->actingAs($this->memberUser);
    $this->post(route('tasks.participate', $this->task->id))->assertRedirect()->assertSessionHasErrors('participation');

    $this->assertDatabaseCount('participations', 1);
});

test('a non-member cannot participate in a task', function () {
    $this->actingAs($this->externalUser);

    $this->post(route('tasks.participate', $this->task->id));

    $this->assertDatabaseMissing('participations', [
        'task_id' => $this->task->id,
        'user_id' => $this->externalUser->id,
    ]);
});
