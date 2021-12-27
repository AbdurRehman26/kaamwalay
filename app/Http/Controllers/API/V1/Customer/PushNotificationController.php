<?php

namespace App\Http\Controllers\API\V1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Customer\PushNotificationRequest;
use App\Jobs\Auth\CreateUserDeviceJob;
use Exception;
use Pusher\PushNotifications\PushNotifications;

class PushNotificationController extends Controller
{
    /**
     * @throws Exception
     */
    public function auth(PushNotificationRequest $request): array
    {
        $config = config('services.pusher');

        $beamsClient = new PushNotifications([
            'instanceId' => $config['beams_instance_id'],
            'secretKey' => $config['beams_secret_key'],
        ]);

        CreateUserDeviceJob::dispatch(auth()->user(), $request->validated()['platform'] ?? null);

        return $beamsClient->generateToken(auth()->user()->email);
    }
}
