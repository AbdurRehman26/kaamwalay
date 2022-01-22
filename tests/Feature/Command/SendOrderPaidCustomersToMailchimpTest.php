
<?php

use Illuminate\Support\Facades\Artisan;

it('sync order paid customers to mailchimp', function () {
    Artisan::shouldReceive('call')
        ->once()
        ->with('sync:order-paid-customers')->andReturn([]);
    Artisan::call('sync:order-paid-customers');
});
