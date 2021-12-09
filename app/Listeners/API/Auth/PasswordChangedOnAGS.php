<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerPasswordChanged;
use App\Services\AGS\AgsService;

class PasswordChangedOnAGS
{
    public function __construct(protected AgsService $agsService)
    {
    }

    /**
     * Handle the event.
     *
     * @param  CustomerPasswordChanged $event
     * @return void
     */
    public function handle(CustomerPasswordChanged $event)
    {
        if (! $this->agsService->isEnabled()) {
            logger('Skipping AgsService as it is disabled.');

            return;
        }

        $passwordsAgs['old_password'] = $event->request['current_password'];
        $passwordsAgs['new_password1'] = $event->request['password'];
        $passwordsAgs['new_password2'] = $event->request['password_confirmation'];

        $platform = $event->request['platform'] ?? [];

        $response = $this->agsService->changePassword(
            data: array_merge(
                $passwordsAgs,
                $platform,
            )
        );
        if (! empty($response)) {
            logger('Password updated on AgsService successfully.');
        }
    }
}
