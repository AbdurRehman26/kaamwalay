<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Implicitly grant "Super Admin" role all permissions
        Gate::before(function (User $user, $ability) {
            return $user->isSuperAdmin() ? true : null;
        });

        // Allow access to Laser (log viewer)
        Gate::define('viewLogViewer', function (?User $user) {
            return auth('web')->user()->isSuperAdmin();
        });
    }
}
