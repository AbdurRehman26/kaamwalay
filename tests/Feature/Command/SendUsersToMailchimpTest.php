
<?php

use Illuminate\Support\Facades\Artisan;

it('sync users to mailchimp', function () {
    
    Artisan::shouldReceive('call')
        ->once()
        ->with('sync:users')->andReturn([]); 
    Artisan::call('sync:users');
});
