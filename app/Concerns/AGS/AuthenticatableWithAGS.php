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
    public function __construct(protected AgsService $agsService)
    {
    }

    public function loginAGS(LoginRequest $request): string
    {
        throw_unless($this->agsService->isEnabled(), AuthenticationException::class);

        $response = $this->agsService->login(data: $request->validated());

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
        $user->assignCustomerNumber();

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
