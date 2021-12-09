<?php

namespace App\Http\Controllers\API\Auth;

use App\Concerns\AGS\AuthenticatableWithAGS;
use App\Events\API\Auth\CustomerPasswordChanged;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Auth\ChangePasswordRequest;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ChangePasswordController extends Controller
{
    use AuthenticatableWithAGS;

    public function change(ChangePasswordRequest $request): JsonResponse
    {
        $user = auth()->user();

        CustomerPasswordChanged::dispatch($user, $request->only('current_password', 'password', 'password_confirmation', 'platform'));

        $this->changePassword($user, $request->password);

        $token = $this->fetchAuthTokenFromAgs($user, $request->password);

        return new JsonResponse([
            'access_token' => $token,
            'type' => 'bearer',
            'expiry' => config('jwt.ttl'),
        ], Response::HTTP_CREATED);
    }

    protected function changePassword(Authenticatable $user, string $password): void
    {
        $user->password = $password;
        $user->setRememberToken(Str::random(60));

        $user->save();
    }

    protected function fetchAuthTokenFromAgs(Authenticatable $user, string $password): string
    {
        $credentials = ['email' => $user->email, 'password' => $password];
        $response = $this->agsService->login($credentials);

        if (! empty($response['access_token'])) {
            $user->ags_access_token = $response['access_token'];
        }

        return auth()->guard()->attempt($credentials);
    }
}
