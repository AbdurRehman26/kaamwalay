
<?php

use Illuminate\Support\Facades\Artisan;

it('sync users to mailchimp', function () {
    Artisan::shouldReceive('call')
        ->once()
        ->with('users:sync-to-mailchimp')->andReturn([]);
    Artisan::call('users:sync-to-mailchimp');
});
