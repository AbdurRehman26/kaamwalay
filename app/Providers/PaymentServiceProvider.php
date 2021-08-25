<?php

namespace App\Providers;

use App\Services\Payment\Providers\StripeService;
use App\Services\Payment\Providers\TestingStripeService;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

class PaymentServiceProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->resolveStripe();
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    protected function resolveStripe(): void
    {
        $this->app->singleton(StripeService::class, function ($app) {
            if ($app->environment('testing')) {
                return new TestingStripeService();
            }

            return new StripeService();
        });
    }


    public function provides(): array
    {
        return [StripeService::class];
    }
}
