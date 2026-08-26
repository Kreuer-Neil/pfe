<?php

namespace Tests\Browser;

use App\Models\Location;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class NewsTest extends DuskTestCase
{
    use DatabaseMigrations;

    public function test_admin_can_post_project_news(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->create([
            'owner_id' => $owner->id,
            'is_private' => true,
            'location_id' => Location::factory(),
        ]);
        $title = 'Dusk update ' . uniqid();

        $this->browse(function (Browser $browser) use ($owner, $project, $title) {
            $browser->useEnglish()
                ->loginAs($owner)
                ->visit('/projects/' . $project->slug)
                ->waitForText('Post an update')
                ->press('Post an update')
                ->waitFor('#news-create[open]')
                ->type('title', $title)
                ->type('text_content', 'Posted end-to-end by a Dusk test.')
                ->within('#news-create', function (Browser $browser) {
                    $browser->press('Post');
                })
                ->waitForText($title);
        });

        $this->assertDatabaseHas('project_news', [
            'project_id' => $project->id,
            'title' => $title,
        ]);
    }
}
