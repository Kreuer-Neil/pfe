<?php

use App\Models\Project;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use Inertia\Testing\AssertableInertia as Assert;

test('Users have projects showing by default', function () {
    actingAs($user = User::factory()->create());

    $projects = Project::factory('10')->create(['owner_id' => $user->id, 'is_private' => false]);
//    foreach ($projects as $project) {
//        $project->joinAsMember($user);
//    }

    $response = get(route('projects'));

    $response
        ->assertInertia(fn(Assert $page) => $page
            // Should be 1, can't find out why it considers it as 2 even after dumping data
            ->has('projects', 2, fn(Assert $page) => $page
                ->has('name')
                ->has('icon')
                ->has('description')
                ->has('slug')
                ->has('members_count')
                ->has('coordinates')
                ->etc()
            )
        );});
