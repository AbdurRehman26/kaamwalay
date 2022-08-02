<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\UserLoggedIn;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class UpdateLoginInformation implements ShouldBeEncrypted
{
    public function __construct()
    {
    }

    public function handle(UserLoggedIn $event): void
    {
        $event->user->update([
            'last_login_at' => Carbon::now(),
        ]);
    }
}
