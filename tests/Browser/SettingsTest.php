<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class SettingsTest extends DuskTestCase
{
    use DatabaseMigrations;

    public function test_user_can_update_profile_settings(): void
    {
        $user = User::factory()->create();

        $this->browse(function (Browser $browser) use ($user) {
            $browser->loginAs($user)
                ->visit('/settings/profile')
                ->waitFor('[data-test="update-profile-button"]')
                ->click('[data-test="update-profile-button"]')
                ->waitForText('Saved');
        });
    }
}
