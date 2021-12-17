<?php

namespace Tests;

use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Spatie\Permission\PermissionRegistrar;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, LazilyRefreshDatabase;
    protected function setUp(): void
    {
        parent::setUp();
        
        // now re-register all the roles and permissions (clears cache and reloads relations)
        $this->app->make(PermissionRegistrar::class)->registerPermissions();
    }
}
