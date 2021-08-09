<?php

namespace App\Concerns\AGS;

use App\Http\Requests\API\Auth\LoginRequest;
use App\Models\User;
use App\Services\AGS\AGS;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Arr;
use Symfony\Component\HttpFoundation\Response;

trait AuthenticatableWithAGS
{
    public function loginAGS(LoginRequest $request): string
    {
        $ags = new AGS();

        throw_if(! $ags->isEnabled(), AuthenticationException::class, 'Unauthorized');

        $response = $ags->client()->post('/login/', $request->validated());

        $this->validateResponse($response);

        $userData = $response->json()['user'];

        return $this->authenticateAgsUser($this->manageAgsUser($request, $userData));
    }

    public function manageAgsUser(LoginRequest $request, array $userData): User
    {
        return User::updateOrCreate(
            [
                'email' => $request->get('email'),
            ],
            array_merge(
                Arr::except($userData, 'pk', 'email'),
                ['password' => $request->get('password')]
            )
        );
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
            AuthenticationException::class,
            'Unauthorized'
        );
    }
}
