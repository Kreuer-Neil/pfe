<?php

use App\Models\Project;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use Inertia\Testing\AssertableInertia as Assert;

test('Users have projects showing by default', function () {
    actingAs($user = User::factory()->create());

    Project::factory(10)->create(['owner_id' => $user->id, 'is_private' => false]);

    $response = get(route('projects'));

    $response
        ->assertInertia(fn(Assert $page) => $page
            ->has('projects', 10, fn(Assert $page) => $page
                ->has('name')
                ->has('icon')
                ->has('description')
                ->has('slug')
                ->has('members_count')
                ->has('location')
                ->has('place')
                ->has('distance')

                // Not seeded yet.
                // ->has('tags')
                ->etc()
            )
        );
});
