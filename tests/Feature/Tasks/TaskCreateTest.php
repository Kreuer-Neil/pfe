<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

beforeEach(function () {
    $this->adminUser = User::factory()->create();
    $this->project = Project::factory()->create(['owner_id' => $this->adminUser->id, 'is_private' => false]);

    $this->externalUser = User::factory()->create();
    $this->memberUser = User::factory()->create();
    $this->managerUser = User::factory()->create();

    $memberUsers = [
        ['user' => $this->adminUser, 'role' => ProjectRole::ADMIN],
        ['user' => $this->memberUser, 'role' => ProjectRole::MEMBER],
        ['user' => $this->managerUser, 'role' => ProjectRole::TASK_MANAGER],
    ];

    foreach ($memberUsers as $user) {
        Member::firstOrCreate([
            'user_id' => $user['user']->id,
            'project_id' => $this->project->id,
        ],[
            'role' => $user['role'],
        ]);
    }

    $this->testTaskPayload = [
        'project_slug' => $this->project->slug,
        'title' => 'A test task',
        'description' => 'Some task description',
        'due_date' => now()->addDays(3)->format('Y-m-d'),
        'due_time' => '14:30',
    ];
});

test('task manager can create a task', function () {
    $this->actingAs($this->managerUser);

    $this->post(route('tasks.store'), $this->testTaskPayload)->assertRedirect();

    $this->assertDatabaseHas('tasks', [
        'project_id' => $this->project->id,
        'user_id' => $this->managerUser->id,
        'title' => $this->testTaskPayload['title'],
        'due_at' => $this->testTaskPayload['due_date'] . ' ' . $this->testTaskPayload['due_time'],
    ]);
});

test('project admin can create a task', function () {
    $this->actingAs($this->adminUser);

    $this->post(route('tasks.store'), $this->testTaskPayload)->assertRedirect();

    $this->assertDatabaseHas('tasks', ['title' => $this->testTaskPayload['title']]);
});

test('plain member cannot create a task', function () {
    $this->actingAs($this->memberUser);

    $this->post(route('tasks.store'), $this->testTaskPayload)->assertForbidden();

    $this->assertDatabaseMissing('tasks', ['title' => $this->testTaskPayload['title']]);
});

test('non-member cannot create a task', function () {
    $this->actingAs($this->externalUser);

    $this->post(route('tasks.store'), $this->testTaskPayload)->assertForbidden();
});

test('a due date in the past is rejected', function () {
    $this->actingAs($this->managerUser);

    $this->post(route('tasks.store'), [
        ...$this->testTaskPayload,
        'due_date' => now()->subDay()->format('Y-m-d'),
    ])->assertSessionHasErrors('due_date');

    $this->assertDatabaseMissing('tasks', ['title' => $this->testTaskPayload['title']]);
});

test('an unknown project slug is rejected', function () {
    $this->actingAs($this->managerUser);

    $this->post(route('tasks.store'), [
        ...$this->testTaskPayload,
        'project_slug' => 'does-not-exist',
    ])->assertSessionHasErrors('project_slug');
});
