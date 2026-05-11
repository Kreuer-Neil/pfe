<?php

use App\Enums\ProjectRole;
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
    Member::create(['user_id' => $this->user->id, 'project_id' => $this->project->id, 'role' => ProjectRole::ADMIN]);

    Task::factory(10)->create([
        'project_id' => $this->project->id,
        'user_id' => 1
    ]);

    foreach (User::all() as $user) {
        // Add all users to the projects
        Member::create([
            'user_id' => $user->id,
            'project_id' => $this->project->id
        ]);

        if ($user['id'] != $this->user->id) {
            foreach (Task::all()->random(4) as $task) {
                $task->participate($user);
            }
        }
    }

    // Make our user participate to tasks
    foreach (($this->userTasks = Task::all()->where('due_at', '>', now())->random(3)) as $userTask) {
        $userTask->participate($this->user);
    }

    $this->response = $this->get(route('dashboard'));
});

test('upcoming tasks load correctly', function () {

    foreach ($this->userTasks as $userTask) {
        $this->response->assertSeeText($userTask->title);

        // TODO assertion that contacts participating load when set up
        // TODO assertion that tasks load when clicking "show more"
    }
});

test('non-taken tasks doesn’t appear', function () {
    $userTasks = $this->userTasks->toArray();
    $userTasksIds = [];
    for ($i = 0; $i < 3; $i++) {
        $userTasksIds[$i] = $userTasks[$i]['id'];
    }
    // React is a BIG LOAD OF $#17 so the whole data from the app is loaded in a div and there's nothing to do against it.
    foreach (Task::all()->whereNotIn('id', $userTasksIds) as $task) {
        $this->response->assertDontSeeText($task->title);
    }
});


test('projects load correctly', function () {
    foreach ($this->user->projects as $project) {
        $this->response->assertSeeText($project->name);
    }
});

//test('users can open a project from the project thumbnail', function () {
//    // Test with laravel Dusk
//});
