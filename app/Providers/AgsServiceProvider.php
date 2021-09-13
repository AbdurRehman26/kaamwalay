<?php

namespace App\Providers;

use App\APIClients\AGSClient;
use App\Services\AGS\AgsService;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

class AgsServiceProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(AgsService::class, function ($app) {
            return new AgsService($app->make(AGSClient::class));
        });
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

    public function provides(): array
    {
        return [AgsService::class];
    }
}
