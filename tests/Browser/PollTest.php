<?php

namespace Tests\Browser;

use App\Models\Location;
use App\Models\Member;
use App\Models\PollChoice;
use App\Models\Project;
use App\Models\ProjectPoll;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class PollTest extends DuskTestCase
{
    use DatabaseMigrations;

    public function test_admin_can_create_a_poll(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->create([
            'owner_id' => $owner->id,
            'is_private' => true,
            'location_id' => Location::factory(),
        ]);
        $title = 'Dusk poll ' . uniqid();

        $this->browse(function (Browser $browser) use ($owner, $project, $title) {
            $browser->useEnglish()
                ->loginAs($owner)
                ->visit('/projects/' . $project->slug)
                ->waitForText('Create a poll')
                ->press('Create a poll')
                ->waitFor('#poll-create[open]')
                ->pause(300)
                // News/poll/task creation modals all name their title field "title" (and this page
                // renders News's and Task's dialogs earlier in the DOM) - scope every interaction to
                // this dialog so field lookups can't resolve into a different, closed modal.
                ->within('#poll-create', function (Browser $browser) use ($title) {
                    $browser->type('title', $title);

                    // Chrome's native datetime-local widget interprets sendKeys() character-by-
                    // character into date/time segments rather than as plain text, so typing a
                    // formatted string (e.g. "2026-09-02T14:25") garbles into nonsense like
                    // "20/02/60902 14:25" - set the value directly via JS instead.
                    $browser->script(
                        "var el = document.querySelector('#poll-create input[name=\"end_date\"]');"
                        . "el.value = '" . now()->addWeek()->format('Y-m-d\TH:i') . "';"
                        . "el.dispatchEvent(new Event('input', {bubbles: true}));"
                        . "el.dispatchEvent(new Event('change', {bubbles: true}));"
                    );

                    $browser->type('.flex.flex-col.gap-2 > div:nth-child(1) input[name="choices[]"]', 'Option A')
                        ->type('.flex.flex-col.gap-2 > div:nth-child(2) input[name="choices[]"]', 'Option B')
                        ->press('Create poll');
                })
                ->waitForText($title);
        });

        $this->assertDatabaseHas('project_polls', [
            'project_id' => $project->id,
            'title' => $title,
        ]);
    }

    public function test_member_can_vote_on_a_poll(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();
        $project = Project::factory()->create([
            'owner_id' => $owner->id,
            'is_private' => true,
            'location_id' => Location::factory(),
        ]);
        Member::create([
            'project_id' => $project->id,
            'user_id' => $member->id,
            'role' => 'member',
        ]);
        $poll = ProjectPoll::factory()->create([
            'project_id' => $project->id,
            'user_id' => $owner->id,
            'multi' => false,
            'end_date' => now()->addWeek(),
        ]);
        $choiceA = PollChoice::factory()->create(['project_poll_id' => $poll->id, 'label' => 'Yes', 'position' => 0]);
        PollChoice::factory()->create(['project_poll_id' => $poll->id, 'label' => 'No', 'position' => 1]);

        $this->browse(function (Browser $browser) use ($member, $project, $poll, $choiceA) {
            $browser->useEnglish()
                ->loginAs($member)
                ->visit('/projects/' . $project->slug)
                ->waitForText($poll->title)
                ->click('#poll-' . $poll->id . '-choice-' . $choiceA->id)
                ->press('Vote')
                ->pause(500);
        });

        $this->assertDatabaseHas('poll_participations', [
            'project_poll_id' => $poll->id,
            'poll_choice_id' => $choiceA->id,
            'user_id' => $member->id,
        ]);
    }
}
