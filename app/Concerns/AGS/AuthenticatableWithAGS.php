<?php

namespace App\Concerns\AGS;

use App\Exceptions\API\Auth\AuthenticationException;
use App\Http\Requests\API\Auth\LoginRequest;
use App\Models\User;
use App\Services\AGS\AgsService;
use App\Services\Payment\Providers\StripeService;
use Illuminate\Support\Arr;

trait AuthenticatableWithAGS
{
    public function loginAGS(LoginRequest $request): string
    {
        $ags = new AgsService;

        throw_unless($ags->isEnabled(), AuthenticationException::class);

        $response = $ags->login(data: $request->validated());

        $this->validateResponse($response);

        return $this->authenticateAgsUser($this->manageAgsUser($request, $response['user']));
    }

    public function manageAgsUser(LoginRequest $request, array $userData): User
    {
        /** @var User $user */
        $user = User::updateOrCreate(
            [
                'email' => $request->get('email'),
            ],
            array_merge(
                Arr::except($userData, 'pk', 'email'),
                ['password' => $request->get('password')]
            )
        );

        $user->assignCustomerRole();

        resolve(StripeService::class)->createCustomerIfNull($user);

        return $user;
    }

    public function authenticateAgsUser(User $user): string
    {
        return auth()->guard()->login($user);
    }

    public function validateResponse(array $response): void
    {
        throw_unless(
            Arr::has($response, 'access_token'),
            AuthenticationException::class
        );
    }
}
