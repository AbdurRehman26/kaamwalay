<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerPasswordChanged;
use App\Exceptions\API\Customer\InvalidAgsDataForCustomer;
use App\Services\AGS\AgsService;
use Symfony\Component\HttpFoundation\Response;

class PasswordChangedOnAGS
{
    public function __construct(protected AgsService $agsService)
    {
    }

    /**
     * Handle the event.
     *
     * @param  CustomerPasswordChanged  $event
     * @return void
     * @throws \Throwable
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
            $event->user,
            data: array_merge(
                $passwordsAgs,
                $platform,
            )
        );

        if (! empty($response)) {
            throw_if(! empty($response['code']) && $response['code'] === Response::HTTP_BAD_REQUEST, InvalidAgsDataForCustomer::class);

            logger('Password updated on AgsService successfully.');
        }
    }
}
