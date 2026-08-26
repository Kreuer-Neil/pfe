<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class AuthTest extends DuskTestCase
{
    use DatabaseMigrations;

    public function test_login_with_valid_credentials_redirects_to_dashboard(): void
    {
        // UserFactory enables 2FA by default (mirrors real users, who set it up post-registration) -
        // a real credentials-driven login would stop at the 2FA challenge screen instead of reaching
        // the dashboard, so this test (unlike loginAs()-based tests elsewhere) needs it switched off.
        $user = User::factory()->withoutTwoFactor()->create();

        $this->browse(function (Browser $browser) use ($user) {
            // Dusk reuses the same browser window across test methods in this class, so a session
            // left authenticated by a previous test would otherwise bounce a `guest`-only route
            // (like /login) straight to /dashboard before this test's own assertions run.
            $browser->logout()
                ->visit('/login')
                ->waitFor('input[name="email"]', 10)
                ->pause(500)
                ->type('email', $user->email)
                ->type('password', 'password')
                ->click('[data-test="login-button"]')
                ->waitForLocation('/dashboard', 15)
                ->assertPathIs('/dashboard');
        });
    }

    public function test_login_with_invalid_credentials_shows_error(): void
    {
        $user = User::factory()->create();

        $this->browse(function (Browser $browser) use ($user) {
            $browser->logout()
                ->useEnglish()
                ->visit('/login')
                ->waitFor('input[name="email"]', 10)
                ->pause(500)
                ->type('email', $user->email)
                ->type('password', 'wrong-password')
                ->click('[data-test="login-button"]')
                ->waitForText('These credentials do not match our records.', 15)
                ->assertPathIs('/login');
        });
    }

    public function test_registration_creates_account_and_redirects_to_onboarding(): void
    {
        // Email verification is wired up (routes, controllers) but not actually enforced - Fortify's
        // Features::emailVerification() is commented out in config/fortify.php and User doesn't
        // implement MustVerifyEmail, so the `verified` middleware is a no-op here. A fresh
        // registration instead lands on /onboarding (via the `onboarded` middleware gate), not
        // /verify-email.
        $email = 'dusk-' . uniqid() . '@example.com';

        $this->browse(function (Browser $browser) use ($email) {
            $browser->logout()
                ->visit('/register')
                ->waitFor('input[name="first_name"]', 10)
                ->pause(500)
                ->type('first_name', 'Dusk')
                ->type('last_name', 'Tester')
                ->type('email', $email)
                ->type('password', 'password123')
                ->type('password_confirmation', 'password123')
                ->click('[data-test="register-user-button"]')
                ->waitForLocation('/onboarding', 15)
                ->assertPathIs('/onboarding');
        });

        $this->assertDatabaseHas('users', ['email' => $email]);
    }

    public function test_logout_redirects_away_from_authenticated_pages(): void
    {
        $user = User::factory()->create();

        $this->browse(function (Browser $browser) use ($user) {
            $browser->useEnglish()
                ->loginAs($user)
                ->visit('/settings/profile')
                ->waitForText('Log out')
                ->pause(500)
                ->press('Log out')
                ->waitForLocation('/login', 15)
                ->assertPathIs('/login')
                ->visit('/dashboard')
                ->assertPathIs('/login');
        });
    }
}
