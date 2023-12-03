<?php

use App\Console\Commands\SendScheduledNotificationsCommand;

it('processes scheduled notifications', function () {
    $this->artisan(SendScheduledNotificationsCommand::class)
        ->assertExitCode(0);
});
