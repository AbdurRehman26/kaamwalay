<?php

namespace App\Http\Controllers\API\V1\Auth;

use App\Concerns\AGS\AuthenticatableWithAGS;
use App\Exceptions\API\Auth\AuthenticationException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Auth\LoginRequest;
use App\Http\Resources\API\V1\Customer\User\UserResource;
use App\Jobs\Auth\CreateUserDeviceJob;
use App\Services\CustomerProfileService;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends Controller
{
    use AuthenticatableWithAGS;

    public function login(LoginRequest $request): JsonResponse
    {
        $data = array_merge($request->only('email', 'password'), ['is_active' => true]);
        $token = auth()->attempt($data);

        if (! $token) {
            $token = $this->loginAGS($request);
        }

        CreateUserDeviceJob::dispatch(auth()->user(), $request->validated()['platform'] ?? null);

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

            throw_if(empty($response), AuthenticationException::class);

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
