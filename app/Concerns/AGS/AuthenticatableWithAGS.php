<?php

namespace App\Concerns\AGS;

use App\Exceptions\API\Auth\AuthenticationException;
use App\Http\Requests\API\Auth\LoginRequest;
use App\Models\User;
use App\Services\AGS\AGS;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

trait AuthenticatableWithAGS
{
    public function loginAGS(LoginRequest $request): string
    {
        $ags = new AGS();

        throw_unless($ags->isEnabled(), AuthenticationException::class);

        $response = Http::post($ags->baseUrl() . '/login/', $request->validated());

        $this->validateResponse($response);

        $userData = $response->json()['user'];

        return $this->authenticateAgsUser($this->manageAgsUser($request, $userData));
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
        if (! $user->hasStripeId()) {
            $user->createAsStripeCustomer();
        }

        return $user;
    }

    public function authenticateAgsUser(User $user): string
    {
        return auth()->guard()->login($user);
    }

    public function validateResponse($response): void
    {
        throw_unless(
            $response->status() === Response::HTTP_OK
            && Arr::has($response->json(), 'access_token'),
            AuthenticationException::class
        );
    }
}
