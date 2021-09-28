<?php

it('processes scheduled emails', function () {
    $this->artisan('emails:send-scheduled')
        ->assertExitCode(0);
});
