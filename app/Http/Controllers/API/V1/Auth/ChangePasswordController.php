<?php

namespace App\Http\Controllers\API\V1\Auth;

use App\Concerns\AGS\AuthenticatableWithAGS;
use App\Exceptions\API\Customer\InvalidAgsDataForCustomer;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Auth\ChangePasswordRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ChangePasswordController extends Controller
{
    use AuthenticatableWithAGS;

    /**
     * @throws \Throwable
     */
    public function change(ChangePasswordRequest $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user->ags_access_token) {
            $this->fetchAndSaveAuthTokenFromAgs($user, $request->current_password);
        }

        $this->changePasswordOnAgs($user, $request->only('current_password', 'password', 'password_confirmation'));

        $this->changePassword($user, $request->password);

        $this->fetchAndSaveAuthTokenFromAgs($user, $request->password);

        $token = auth()->guard()->attempt(['email' => $user->email, 'password' => $request->password]);

        return new JsonResponse([
            'access_token' => $token,
            'type' => 'bearer',
            'expiry' => config('jwt.ttl'),
        ], Response::HTTP_CREATED);
    }

    protected function changePassword(User $user, string $password): void
    {
        $user->password = $password;
        $user->setRememberToken(Str::random(60));

        $user->save();
    }

    protected function fetchAndSaveAuthTokenFromAgs(User $user, string $password): void
    {
        $credentials = ['email' => $user->email, 'password' => $password];
        $response = $this->agsService->login($credentials);

        if (! empty($response['access_token'])) {
            $user->ags_access_token = $response['access_token'];
            $user->save();
        }
    }

    /**
     * @throws \Throwable
     */
    protected function changePasswordOnAgs(User $user, array $data): void
    {
        if (! $this->agsService->isEnabled()) {
            logger('Skipping AgsService as it is disabled.');

            return;
        }

        $passwordsAgs['old_password'] = $data['current_password'];
        $passwordsAgs['new_password1'] = $data['password'];
        $passwordsAgs['new_password2'] = $data['password_confirmation'];

        $response = $this->agsService->changePassword(
            $user->ags_access_token,
            data: $passwordsAgs
        );

        if (! empty($response['code'])) {
            throw_if(
                ! empty($response['code']) && $response['code'] === Response::HTTP_BAD_REQUEST,
                new InvalidAgsDataForCustomer($response['message'], Response::HTTP_UNPROCESSABLE_ENTITY)
            );
        }
    }
}
