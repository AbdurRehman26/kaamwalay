<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\UserLogin;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class SaveLoginInformation implements ShouldBeEncrypted
{
    public function __construct()
    {
    }

    public function handle(UserLogin $event): void
    {
        $event->user->update([
            'last_login_at' => Carbon::now(),
        ]);
    }
}
