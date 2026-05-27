<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

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
        Member::create([
            'user_id' => $user['user']->id,
            'project_id' => $this->project->id,
            'role' => $user['role'],
        ]);
    }
});


test('Users with role can create tasks', function () {
    $this->actingAs($this->managerUser);

    $this->get(route('projects.show',$this->project->slug))
        ->assertInertia(fn (Assert $page)=> $page
            ->component('projects/show')
            ->has('task',fn(Assert $page) => $page
            ->has(''))
        );

    // Try store
    // route('tasks.store', $this->project->id);
});
