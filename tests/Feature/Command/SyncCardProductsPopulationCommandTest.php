<?php

it('syncs card products population values from reports', function () {
    $this->artisan('card-product:sync-population')
        ->assertExitCode(0);
});
