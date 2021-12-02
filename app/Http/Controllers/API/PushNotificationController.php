<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Exception;
use Pusher\PushNotifications\PushNotifications;

class PushNotificationController extends Controller
{
    /**
     * @throws Exception
     */
    public function auth(): array
    {
        $config = config('services.pusher');

        $beamsClient = new PushNotifications([
            'instanceId' => $config['beams_instance_id'],
            'secretKey' => $config['beams_secret_key'],
        ]);

        return $beamsClient->generateToken(auth()->user()->email);
    }
}
