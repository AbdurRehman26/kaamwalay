<?php

use Illuminate\Support\Facades\Artisan;

it('sync order paid customers to mailchimp', function () {
    Artisan::shouldReceive('call')
        ->once()
        ->with('users:sync-order-paid-customers-to-mailchimp')->andReturn([]);
    Artisan::call('users:sync-order-paid-customers-to-mailchimp');
});
