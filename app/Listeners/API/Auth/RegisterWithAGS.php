<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\AGS\AgsService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class RegisterWithAGS implements ShouldQueue, ShouldBeEncrypted
{
    public function __construct(protected AgsService $agsService)
    {
    }

    /**
     * Handle the event.
     *
     * @param CustomerRegistered $event
     * @return void
     */
    public function handle(CustomerRegistered $event): void
    {
        if (! $this->agsService->isEnabled()) {
            logger('Skipping AgsService as it is disabled.');

            return;
        }
        $password = $event->request['password'];
        $passwordKeysForAgs = ['password1', 'password2'];
        $user = $event->user;
        $platform = $event->request['platform'] ?? [];

        $response = $this->agsService->register(
            data: array_merge(
                $user->only('first_name', 'last_name', 'username', 'email'),
                array_fill_keys($passwordKeysForAgs, $password),
                $platform,
                ['app_generated_id' => 'w' . Str::random(5) . time()]
            )
        );
        if (! empty($response)) {
            logger('User created on AgsService successfully.', ['user_id' => $user->id]);
        }
    }
}
