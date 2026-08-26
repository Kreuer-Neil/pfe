<?php

namespace Tests\Browser;

use App\Models\Location;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class DashboardTest extends DuskTestCase
{
    use DatabaseMigrations;

    public function test_dashboard_shows_the_users_own_projects(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->create([
            'owner_id' => $owner->id,
            'is_private' => true,
            'location_id' => Location::factory(),
        ]);

        $this->browse(function (Browser $browser) use ($owner, $project) {
            $browser->loginAs($owner)
                ->visit('/dashboard')
                ->waitForText($project->name)
                ->assertSee($project->name);
        });
    }
}
