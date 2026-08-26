<?php

namespace Tests;

use Facebook\WebDriver\Chrome\ChromeOptions;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Illuminate\Support\Collection;
use Laravel\Dusk\Browser;
use Laravel\Dusk\TestCase as BaseTestCase;
use PHPUnit\Framework\Attributes\BeforeClass;

abstract class DuskTestCase extends BaseTestCase
{
    /**
     * Prepare for Dusk test execution.
     */
    #[BeforeClass]
    public static function prepare(): void
    {
        if (! static::runningInSail()) {
            static::startChromeDriver(['--port=9515']);
        }
    }

    /**
     * Individual test classes' DatabaseMigrations trait re-runs migrate:fresh before every
     * test, which wipes the languages table - but projects.language_id defaults to 1 with a
     * FK constraint, so every Project factory create() needs a real Language row to exist.
     */
    protected function setUp(): void
    {
        parent::setUp();

        if (\App\Models\Language::count() === 0) {
            $this->artisan('db:seed', ['--class' => \Database\Seeders\LanguagesSeeder::class]);
        }

        // The frontend picks its i18next locale from the browser's Accept-Language header
        // when no `lang` cookie is set yet - on a machine with a non-English system locale
        // (confirmed via a failure screenshot: the app rendered in French), tests asserting
        // on English button/link text would otherwise fail depending on the host's locale.
        if (! Browser::hasMacro('useEnglish')) {
            Browser::macro('useEnglish', function () {
                /** @var Browser $this */
                return $this->visit('/lang?lang=en');
            });
        }
    }

    /**
     * Create the RemoteWebDriver instance.
     */
    protected function driver(): RemoteWebDriver
    {
        $options = (new ChromeOptions)->addArguments(collect([
            $this->shouldStartMaximized() ? '--start-maximized' : '--window-size=1920,1080',
            '--disable-search-engine-choice-screen',
            '--disable-smooth-scrolling',
        ])->unless($this->hasHeadlessDisabled(), function (Collection $items) {
            return $items->merge([
                '--disable-gpu',
                '--headless=new',
            ]);
        })->all());

        return RemoteWebDriver::create(
            $_ENV['DUSK_DRIVER_URL'] ?? env('DUSK_DRIVER_URL') ?? 'http://localhost:9515',
            DesiredCapabilities::chrome()->setCapability(
                ChromeOptions::CAPABILITY, $options
            )
        );
    }
}
