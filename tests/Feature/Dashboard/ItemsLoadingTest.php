<?php

use App\Models\Member;
use App\Models\Participation;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;

beforeEach(function () {
    User::factory(5)->create();
    $this->actingAs($this->user = User::factory()->create());

    $this->project = Project::factory()->create(['owner_id' => 1]);

    Task::factory(10)->create([
        'project_id' => $this->project->id,
        'user_id' => 1
    ]);

    foreach (User::all()->toArray() as $user) {
        // Add all users to the projects
        Member::create([
            'user_id' => $user['id'],
            'project_id' => $this->project->id
        ]);

        if ($user['id'] != $this->user->id) {
            foreach (Task::all()->random(4) as $task) {
                $task->participate($this->user);
            }
        }
    }

    // Make our user participate to tasks
    foreach (($this->userTasks = Task::all()->where('due_at', '>', now())->random(3)) as $userTask) {
        $userTask->participate($this->user);
    }

});

test('upcoming tasks load correctly', function () {
    $response = $this->get(route('dashboard'));

    foreach ($this->userTasks as $userTask) {
        $response->assertSee($userTask['title']);
    }
});
