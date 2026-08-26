<?php

namespace Tests\Browser;

use App\Models\Location;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ChatTest extends DuskTestCase
{
    use DatabaseMigrations;

    public function test_member_can_send_a_chat_message(): void
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
        $content = 'Dusk chat message ' . uniqid();

        $this->browse(function (Browser $browser) use ($member, $project, $content) {
            $browser->useEnglish()
                ->loginAs($member)
                ->visit('/projects/' . $project->slug . '/chats')
                ->waitFor('textarea[name="content"]')
                ->type('content', $content)
                ->press('Send')
                ->pause(1000)
                // The message list only picks up new messages via the Reverb broadcast echo
                // (BROADCAST_CONNECTION=log in the dusk env, no real server) - a real Reverb
                // connection isn't available here, so reload the page and check the persisted,
                // server-rendered message list instead of waiting on a live UI update that can't
                // arrive in this environment.
                ->visit('/projects/' . $project->slug . '/chats')
                ->waitForText($content);
        });

        $this->assertDatabaseHas('chat_messages', [
            'content' => $content,
            'user_id' => $member->id,
        ]);
    }
}
