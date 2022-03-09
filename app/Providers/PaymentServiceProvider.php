<?php

namespace App\Providers;

use App\Services\Payment\V1\Providers\StripeService as V1StripeService;
use App\Services\Payment\V1\Providers\TestingStripeService as V1TestingStripeService;
use App\Services\Payment\V2\Providers\StripeService as V2StripeService;
use App\Services\Payment\V2\Providers\TestingStripeService as V2TestingStripeService;
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
        $this->app->singleton(V1StripeService::class, function ($app) {
            if ($app->environment('testing')) {
                return new V1TestingStripeService();
            }

            return new V1StripeService();
        });

        $this->app->singleton(V2StripeService::class, function ($app) {
            if ($app->environment('testing')) {
                return new V2TestingStripeService();
            }

            return new V2StripeService();
        });
    }


    public function provides(): array
    {
        return [V1StripeService::class, V2StripeService::class];
    }
}
