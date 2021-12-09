<?php

namespace App\Http\Controllers\API\Auth;

use App\Concerns\AGS\AuthenticatableWithAGS;
use App\Exceptions\API\Customer\InvalidAgsDataForCustomer;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Auth\ChangePasswordRequest;
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

        $this->changePasswordOnAgs($user, $request->only('current_password', 'password', 'password_confirmation'));

        $this->changePassword($user, $request->password);

        $token = $this->fetchAuthTokenFromAgs($user, $request->password);

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

    protected function fetchAuthTokenFromAgs(User $user, string $password): string
    {
        $credentials = ['email' => $user->email, 'password' => $password];
        $response = $this->agsService->login($credentials);

        if (! empty($response['access_token'])) {
            $user->ags_access_token = $response['access_token'];
        }

        return auth()->guard()->attempt($credentials);
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

        if (! empty($response)) {
            throw_if(
                ! empty($response['code']) && $response['code'] === Response::HTTP_BAD_REQUEST,
                InvalidAgsDataForCustomer::class
            );
        }
    }
}
