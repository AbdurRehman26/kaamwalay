<?php

namespace App\Providers;

use App\Services\Payment\Providers\StripeService;
use App\Services\Payment\Providers\TestingStripeService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(StripeService::class, function ($app) {
            if ($app->environment('testing')) {
                return new TestingStripeService();
            }

            return new StripeService();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
