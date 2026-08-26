<?php

namespace Tests\Browser;

use App\Models\Location;
use App\Models\Member;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class TaskTest extends DuskTestCase
{
    use DatabaseMigrations;

    public function test_project_owner_can_create_a_task(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->create([
            'owner_id' => $owner->id,
            'is_private' => true,
            'location_id' => Location::factory(),
        ]);
        $title = 'Dusk task ' . uniqid();

        $this->browse(function (Browser $browser) use ($owner, $project, $title) {
            $browser->useEnglish()
                ->loginAs($owner)
                ->visit('/projects/' . $project->slug)
                ->waitForText($project->name)
                ->waitFor('#tasks button')
                ->within('#tasks', function (Browser $browser) {
                    $browser->click('button');
                })
                ->waitFor('#task-create[open]')
                ->pause(300)
                // Poll/news/task creation modals all name their title field "title" - scope to
                // this dialog so type() can't resolve into a different (closed) modal's input.
                ->within('#task-create', function (Browser $browser) use ($title) {
                    $browser->type('title', $title)
                        ->type('description', 'Created end-to-end by a Dusk test.')
                        ->press('Add task');
                })
                // Unlike Poll/News's create modals, TaskCreateModal has no onSuccess handler that
                // closes it - it just resets its own fields (resetOnSuccess) and stays open on top
                // of the (now updated) task list, so asserting on visible page text here is
                // unreliable. Assert the actual persisted row below instead.
                ->pause(1000);
        });

        $this->assertDatabaseHas('tasks', [
            'project_id' => $project->id,
            'title' => $title,
        ]);
    }

    public function test_member_can_participate_in_a_task(): void
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
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'user_id' => $owner->id,
            'due_at' => now()->addDays(3),
        ]);

        $this->browse(function (Browser $browser) use ($member, $project, $task) {
            $browser->useEnglish()
                ->loginAs($member)
                ->visit('/projects/' . $project->slug)
                ->waitForText($task->title)
                ->clickLink($task->title)
                // NotificationBell mounts its own (always-present, normally-closed) TaskShowModal
                // under the same "task-show" id, both in the mobile header and the sidebar - so a
                // bare `#task-show` selector can resolve to one of those instead of the one this
                // click actually opened. Qualifying with [open] disambiguates.
                ->waitFor('#task-show[open]')
                ->pause(300)
                ->waitForText('Participate')
                ->within('#task-show[open]', function (Browser $browser) {
                    $browser->press('Participate');
                })
                ->pause(500);
        });

        $this->assertDatabaseHas('participations', [
            'task_id' => $task->id,
            'user_id' => $member->id,
        ]);
    }
}
