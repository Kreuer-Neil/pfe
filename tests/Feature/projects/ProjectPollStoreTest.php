<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

function makeProjectWithMemberForPoll(ProjectRole $role): array
{
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $user = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $user->id, 'role' => $role->value]);

    return [$project, $user];
}

function validPollPayload(): array
{
    return [
        'title' => 'What should we plant next?',
        'multi' => false,
        'end_date' => now()->addWeek()->toDateTimeString(),
        'choices' => ['Tomatoes', 'Carrots'],
    ];
}

test('an admin can create a poll', function () {
    [$project, $admin] = makeProjectWithMemberForPoll(ProjectRole::ADMIN);
    actingAs($admin);

    post(route('projects.polls.store', $project->slug), validPollPayload())->assertRedirect();

    $this->assertDatabaseHas('project_polls', ['project_id' => $project->id, 'user_id' => $admin->id, 'title' => 'What should we plant next?']);
    $poll = $project->polls()->first();
    expect($poll->choices)->toHaveCount(2);
});

test('a moderator can create a poll', function () {
    [$project, $moderator] = makeProjectWithMemberForPoll(ProjectRole::MODERATOR);
    actingAs($moderator);

    post(route('projects.polls.store', $project->slug), validPollPayload())->assertRedirect();

    $this->assertDatabaseHas('project_polls', ['project_id' => $project->id]);
});

test('a task manager can create a poll', function () {
    [$project, $taskManager] = makeProjectWithMemberForPoll(ProjectRole::TASK_MANAGER);
    actingAs($taskManager);

    post(route('projects.polls.store', $project->slug), validPollPayload())->assertRedirect();

    $this->assertDatabaseHas('project_polls', ['project_id' => $project->id]);
});

test('a plain member cannot create a poll', function () {
    [$project, $member] = makeProjectWithMemberForPoll(ProjectRole::MEMBER);
    actingAs($member);

    post(route('projects.polls.store', $project->slug), validPollPayload())->assertForbidden();

    $this->assertDatabaseMissing('project_polls', ['project_id' => $project->id]);
});

test('a poll needs at least 2 choices', function () {
    [$project, $admin] = makeProjectWithMemberForPoll(ProjectRole::ADMIN);
    actingAs($admin);

    post(route('projects.polls.store', $project->slug), [...validPollPayload(), 'choices' => ['Only one']])
        ->assertSessionHasErrors(['choices']);
});

test('end_date must be in the future', function () {
    [$project, $admin] = makeProjectWithMemberForPoll(ProjectRole::ADMIN);
    actingAs($admin);

    post(route('projects.polls.store', $project->slug), [...validPollPayload(), 'end_date' => now()->subDay()->toDateTimeString()])
        ->assertSessionHasErrors(['end_date']);
});
