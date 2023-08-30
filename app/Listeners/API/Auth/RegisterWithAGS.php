<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\AGS\AgsService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

class RegisterWithAGS implements ShouldBeEncrypted, ShouldQueue
{
    public function __construct(protected AgsService $agsService)
    {
    }

    /**
     * Handle the event.
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
        $appGeneratedId = $event->request['app_generated_id'] ?? ['app_generated_id' => 'w'.Str::random(5).time()];

        $response = $this->agsService->register(
            data: array_merge(
                $user->only('first_name', 'last_name', 'username', 'email'),
                array_fill_keys($passwordKeysForAgs, $password),
                $platform,
                $appGeneratedId
            )
        );
        if (! empty($response)) {
            logger('User created on AgsService successfully.', ['user_id' => $user->id]);
        }
    }
}
