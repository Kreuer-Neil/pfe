<?php

use App\Models\Project;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()
        ->hasNotifications(1)
        ->create();
    $this->actingAs($this->user);

    $this->project = Project::factory()
        ->for(User::factory()->create())
//        ->hasTasks(3)
        ->create();
});

/*test('users without project can\'t see any task.', function () {
    $response = $this->get(route('dashboard'));

    $response->assertDontSee($this->project->tasks->toArray());
});*/
