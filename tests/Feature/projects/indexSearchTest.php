<?php

use App\Models\Project;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

test('Users have projects showing by default', function () {
    actingAs($user = User::factory()->create());

    $projects = Project::factory('10')->create(['owner_id' => $user->id, 'is_private' => false]);
//    foreach ($projects as $project) {
//        $project->joinAsMember($user);
//    }

    $response = get(route('projects'));

    foreach ($projects as $project) {
        $response->assertSeeText($project->name);
    }
})->skip();
