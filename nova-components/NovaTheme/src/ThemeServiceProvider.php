<?php

namespace Robograding\NovaTheme;

use Illuminate\Support\ServiceProvider;
use Laravel\Nova\Nova;

class ThemeServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Nova::booted(function () {
            Nova::theme(asset('/robograding/nova-theme/theme.css'));
        });

        $this->publishes([
            __DIR__.'/../resources/css' => public_path('robograding/nova-theme'),
        ], 'public');
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
