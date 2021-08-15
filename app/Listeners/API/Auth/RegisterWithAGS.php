<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\AGS\AGS;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class RegisterWithAGS implements ShouldQueue, ShouldBeEncrypted
{
    /**
     * Handle the event.
     *
     * @param CustomerRegistered $event
     * @return void
     */
    public function handle(CustomerRegistered $event)
    {
        $ags = new AGS();

        if (! $ags->isEnabled()) {
            logger('Skipping AGS as it is disabled.');

            return;
        }
        $password = $event->request['password'];
        $passwordKeysForAgs = ['password1', 'password2'];
        $user = $event->user;

        $response = Http::post(
            $ags->baseUrl() . '/registration/',
            array_merge(
                $user->only('username', 'email'),
                array_fill_keys($passwordKeysForAgs, $password),
                ['app_generated_id' => 'w' . Str::random(5) . time()]
            )
        );

        if ($response->status() === Response::HTTP_CREATED) {
            logger('User created on AGS successfully.', ['user_id' => $user->id]);

            return;
        }
        logger()->error('Error occurred while creating user on AGS', ['user_id' => $user->id]);
    }
}
