<?php

namespace Tests\Browser;

use App\Models\Location;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ProjectTest extends DuskTestCase
{
    use DatabaseMigrations;

    public function test_authenticated_user_can_create_a_project(): void
    {
        $user = User::factory()->create();
        $name = 'Dusk Garden ' . uniqid();

        $this->browse(function (Browser $browser) use ($user, $name) {
            $browser->useEnglish()
                ->loginAs($user)
                ->visit('/projects/create')
                ->waitFor('input[name="name"]')
                ->type('name', $name)
                ->type('description', 'A project created end-to-end by a Dusk test.')
                ->press('Create project')
                ->waitForText($name)
                ->assertSee($name);
        });

        $this->assertDatabaseHas('projects', ['name' => $name, 'owner_id' => $user->id]);
    }

    public function test_visitor_can_join_a_public_project(): void
    {
        $owner = User::factory()->create();
        $visitor = User::factory()->create();
        $project = Project::factory()->create([
            'owner_id' => $owner->id,
            'is_private' => false,
            'location_id' => Location::factory(),
        ]);

        $this->browse(function (Browser $browser) use ($visitor, $project) {
            $browser->useEnglish()
                ->loginAs($visitor)
                ->visit('/projects/' . $project->slug)
                ->waitForText('Join')
                ->clickLink('Join')
                ->waitForLocation('/projects/' . $project->slug)
                ->assertDontSee('Join');
        });

        $this->assertDatabaseHas('members', [
            'project_id' => $project->id,
            'user_id' => $visitor->id,
            'role' => 'member',
        ]);
    }

    public function test_visitor_can_follow_and_unfollow_a_project(): void
    {
        $owner = User::factory()->create();
        $visitor = User::factory()->create();
        $project = Project::factory()->create([
            'owner_id' => $owner->id,
            'is_private' => false,
            'location_id' => Location::factory(),
        ]);

        $this->browse(function (Browser $browser) use ($visitor, $project) {
            $browser->loginAs($visitor)
                ->visit('/projects/' . $project->slug)
                ->waitFor('[data-test="follow-button"]')
                ->click('[data-test="follow-button"]')
                ->waitFor('[data-test="unfollow-button"]');
        });

        $this->assertDatabaseHas('project_follows', [
            'project_id' => $project->id,
            'user_id' => $visitor->id,
        ]);

        $this->browse(function (Browser $browser) use ($visitor, $project) {
            $browser->loginAs($visitor)
                ->visit('/projects/' . $project->slug)
                ->waitFor('[data-test="unfollow-button"]')
                ->click('[data-test="unfollow-button"]')
                ->waitFor('[data-test="follow-button"]');
        });

        $this->assertDatabaseMissing('project_follows', [
            'project_id' => $project->id,
            'user_id' => $visitor->id,
        ]);
    }

    public function test_admin_can_view_project_general_settings(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->create([
            'owner_id' => $owner->id,
            'is_private' => true,
        ]);

        $this->browse(function (Browser $browser) use ($owner, $project) {
            $browser->useEnglish()
                ->loginAs($owner)
                ->visit('/projects/' . $project->slug . '/edit')
                ->waitForText('Appearance')
                ->assertSee('Appearance')
                ->assertSee($project->name);
        });
    }
}
