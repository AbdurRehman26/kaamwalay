<?php

it('sync order paid customers to mailchimp', function () {
    $this->artisan('sync:order-paid-customers')
        ->assertExitCode(0);
});