<?php

namespace App\Http\Controllers\API\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Auth\LoginRequest;
use App\Http\Resources\API\V1\Customer\User\UserResource;
use App\Services\CustomerProfileService;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class LoginController extends Controller
{
    /**
     * @throws Throwable
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $token = auth()->attempt($request->only('email', 'password'));

        if (! $token) {
            $token = $this->loginAGS($request);
        }

        $isActive = auth()->user()->is_active;

        return new JsonResponse(
            [
                'access_token' => $token,
                'type' => 'bearer',
                'expiry' => config('jwt.ttl'),
            ],
            Response::HTTP_OK,
        );
    }

    public function authenticateAndUpdateAgsUserToken(
        LoginRequest $request,
        CustomerProfileService $customerProfileService
    ): JsonResponse {
        try {
            $response = $this->agsService->login(data: $request->validated());

            $customerProfileService->update(
                auth()->guard()->user(),
                ['ags_access_token' => $response['access_token']]
            );
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        return new JsonResponse(
            ['message' => 'User authenticated successfully.'],
            Response::HTTP_OK,
        );
    }

    public function me(): JsonResponse
    {
        return new JsonResponse([
            'data' => [
                'user' => new UserResource(auth()->user()),
            ],
        ], Response::HTTP_OK);
    }
}
