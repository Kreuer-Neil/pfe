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
            ->where('projectsNextPage', null)
        );
});

test('results beyond the first page are not returned until requested', function () {
    actingAs($user = User::factory()->create());

    Project::factory(25)->create(['owner_id' => $user->id, 'is_private' => false]);

    $response = get(route('projects'));

    $response
        ->assertInertia(fn(Assert $page) => $page
            ->has('projects', 20)
            ->where('projectsNextPage', 2)
        );
});

test('the second page of results can be fetched and is the tail of the first', function () {
    actingAs($user = User::factory()->create());

    Project::factory(25)->create(['owner_id' => $user->id, 'is_private' => false]);

    $firstPageSlugs = collect(get(route('projects'))->inertiaProps('projects'))->pluck('slug');

    $response = get(route('projects', ['page' => 2]));

    $response
        ->assertInertia(fn(Assert $page) => $page
            ->has('projects', 5)
            ->where('projectsNextPage', null)
        );

    $secondPageSlugs = collect($response->inertiaProps('projects'))->pluck('slug');

    expect($firstPageSlugs->intersect($secondPageSlugs))->toBeEmpty();
});
