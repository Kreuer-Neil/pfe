<?php

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\PollChoice;
use App\Models\Project;
use App\Models\ProjectPoll;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

function makePollWithChoices(bool $multi = false, ?Carbon $endDate = null): array
{
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $poll = ProjectPoll::factory()->create([
        'project_id' => $project->id,
        'user_id' => $owner->id,
        'multi' => $multi,
        'end_date' => $endDate ?? now()->addWeek(),
    ]);
    $choiceA = PollChoice::factory()->create(['project_poll_id' => $poll->id, 'label' => 'A', 'position' => 0]);
    $choiceB = PollChoice::factory()->create(['project_poll_id' => $poll->id, 'label' => 'B', 'position' => 1]);

    $voter = User::factory()->create();
    Member::create(['project_id' => $project->id, 'user_id' => $voter->id, 'role' => ProjectRole::MEMBER->value]);

    return [$project, $poll, $choiceA, $choiceB, $voter];
}

test('a member can vote on a single-choice poll', function () {
    [$project, $poll, $choiceA, , $voter] = makePollWithChoices();
    actingAs($voter);

    post(route('projects.polls.vote', [$project->slug, $poll->id]), ['choice_ids' => [$choiceA->id]])
        ->assertRedirect();

    $this->assertDatabaseHas('poll_participations', [
        'project_poll_id' => $poll->id,
        'user_id' => $voter->id,
        'poll_choice_id' => $choiceA->id,
    ]);
});

test('voting again replaces the previous vote instead of adding a second row', function () {
    [$project, $poll, $choiceA, $choiceB, $voter] = makePollWithChoices();
    actingAs($voter);

    post(route('projects.polls.vote', [$project->slug, $poll->id]), ['choice_ids' => [$choiceA->id]]);
    post(route('projects.polls.vote', [$project->slug, $poll->id]), ['choice_ids' => [$choiceB->id]]);

    expect($poll->participations()->where('user_id', $voter->id)->count())->toBe(1);
    $this->assertDatabaseHas('poll_participations', [
        'project_poll_id' => $poll->id,
        'user_id' => $voter->id,
        'poll_choice_id' => $choiceB->id,
    ]);
});

test('a multi-choice poll accepts more than one choice', function () {
    [$project, $poll, $choiceA, $choiceB, $voter] = makePollWithChoices(multi: true);
    actingAs($voter);

    post(route('projects.polls.vote', [$project->slug, $poll->id]), ['choice_ids' => [$choiceA->id, $choiceB->id]])
        ->assertRedirect();

    expect($poll->participations()->where('user_id', $voter->id)->count())->toBe(2);
});

test('a single-choice poll rejects more than one selected choice', function () {
    [$project, $poll, $choiceA, $choiceB, $voter] = makePollWithChoices();
    actingAs($voter);

    post(route('projects.polls.vote', [$project->slug, $poll->id]), ['choice_ids' => [$choiceA->id, $choiceB->id]])
        ->assertSessionHasErrors(['choice_ids']);
});

test('skipping stores a null-choice participation row, and skipping again does not duplicate it', function () {
    [$project, $poll, , , $voter] = makePollWithChoices();
    actingAs($voter);

    post(route('projects.polls.vote', [$project->slug, $poll->id]), ['choice_ids' => []]);
    post(route('projects.polls.vote', [$project->slug, $poll->id]), ['choice_ids' => []]);

    expect($poll->participations()->where('user_id', $voter->id)->count())->toBe(1);
    $this->assertDatabaseHas('poll_participations', [
        'project_poll_id' => $poll->id,
        'user_id' => $voter->id,
        'poll_choice_id' => null,
    ]);
});

test('a user who skipped can still come back and vote for real', function () {
    [$project, $poll, $choiceA, , $voter] = makePollWithChoices();
    actingAs($voter);

    post(route('projects.polls.vote', [$project->slug, $poll->id]), ['choice_ids' => []]);
    post(route('projects.polls.vote', [$project->slug, $poll->id]), ['choice_ids' => [$choiceA->id]]);

    expect($poll->participations()->where('user_id', $voter->id)->count())->toBe(1);
    $this->assertDatabaseHas('poll_participations', [
        'project_poll_id' => $poll->id,
        'user_id' => $voter->id,
        'poll_choice_id' => $choiceA->id,
    ]);
});

test('voting on an expired poll is rejected', function () {
    [$project, $poll, $choiceA, , $voter] = makePollWithChoices(endDate: now()->subDay());
    actingAs($voter);

    post(route('projects.polls.vote', [$project->slug, $poll->id]), ['choice_ids' => [$choiceA->id]])
        ->assertSessionHasErrors(['poll']);

    expect($poll->participations()->where('user_id', $voter->id)->count())->toBe(0);
});

test('a non-member cannot vote', function () {
    [$project, $poll, $choiceA] = makePollWithChoices();
    $outsider = User::factory()->create();
    actingAs($outsider);

    post(route('projects.polls.vote', [$project->slug, $poll->id]), ['choice_ids' => [$choiceA->id]])
        ->assertForbidden();
});

test('a choice from another poll is rejected', function () {
    [$project, $poll, , , $voter] = makePollWithChoices();
    $otherChoice = PollChoice::factory()->create();
    actingAs($voter);

    post(route('projects.polls.vote', [$project->slug, $poll->id]), ['choice_ids' => [$otherChoice->id]])
        ->assertSessionHasErrors(['choice_ids.0']);
});

test('results are hidden from a member who has not voted or skipped yet, while the poll is open', function () {
    [$project, $poll, , , $voter] = makePollWithChoices();
    actingAs($voter);

    get(route('projects.show', $project->slug))
        ->assertInertia(fn (Assert $page) => $page
            ->where('project.polls.0.can_see_results', false)
        );
});

test('results become visible to a member once they voted', function () {
    [$project, $poll, $choiceA, , $voter] = makePollWithChoices();
    actingAs($voter);

    post(route('projects.polls.vote', [$project->slug, $poll->id]), ['choice_ids' => [$choiceA->id]]);

    get(route('projects.show', $project->slug))
        ->assertInertia(fn (Assert $page) => $page
            ->where('project.polls.0.can_see_results', true)
            ->where('project.polls.0.total_voters', 1)
        );
});

test('results become visible to everyone once the poll has closed, even without participating', function () {
    [$project, $poll, $choiceA, , $voter] = makePollWithChoices(endDate: now()->subDay());
    actingAs($voter);

    get(route('projects.show', $project->slug))
        ->assertInertia(fn (Assert $page) => $page
            ->where('project.polls.0.can_see_results', true)
            ->where('project.polls.0.is_expired', true)
        );
});
