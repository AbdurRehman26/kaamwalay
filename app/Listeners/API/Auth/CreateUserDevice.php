<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerAuthenticated;
use App\Models\UserDevice;
use Illuminate\Contracts\Queue\ShouldQueue;

class CreateUserDevice implements ShouldQueue
{
    public function handle(CustomerAuthenticated $event): void
    {
        if (! empty($event->platform)) {
            UserDevice::firstOrCreate([
                'user_id' => $event->user->id,
                'platform' => $event->platform,
            ]);
        }
    }
}
