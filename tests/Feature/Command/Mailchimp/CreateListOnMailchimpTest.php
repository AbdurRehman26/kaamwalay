<?php

use Illuminate\Support\Facades\Artisan;

it('create list on mailchimp', function () {
    Artisan::shouldReceive('call')
        ->once()
        ->with('users:create-list-on-mailchimp')->andReturn([]);
    Artisan::call('users:create-list-on-mailchimp');
});
