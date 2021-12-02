<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Models\UserDevice;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

class CreateUserDevice implements ShouldQueue, ShouldBeEncrypted
{
    public function handle(CustomerRegistered $event): void
    {
        UserDevice::firstOrCreate([
            'user_id' => $event->user->id,
            'platform' => $event->request['platform'],
        ]);
    }
}
