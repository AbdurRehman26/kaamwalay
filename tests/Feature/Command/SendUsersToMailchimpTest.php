
<?php
    
it('sync users to mailchimp', function () {
    $this->artisan('sync:users')
        ->assertExitCode(0);
});
