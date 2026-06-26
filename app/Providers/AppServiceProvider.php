<?php

namespace App\Providers;

use App\Policies\ProjectPolicy;
use Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('update-project-appearance', [ProjectPolicy::class, 'updateAppearance']);
        Gate::define('update-project', [ProjectPolicy::class, 'update']);
        Gate::define('view-project', [ProjectPolicy::class, 'view']);
        Gate::define('view-project-data', [ProjectPolicy::class, 'viewData']);
        Gate::define('store-task', [ProjectPolicy::class, 'storeTask']);
    }
}
