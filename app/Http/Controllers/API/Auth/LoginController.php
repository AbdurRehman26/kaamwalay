<?php

namespace App\Http\Controllers\API\Auth;

use App\Concerns\AGS\AuthenticatableWithAGS;
use App\Events\API\Auth\CustomerAuthenticated;
use App\Exceptions\API\Auth\AgsAuthenticationException;
use App\Exceptions\API\Auth\AuthenticationException;
use App\Exceptions\API\Customer\InvalidAgsDataForCustomer;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Auth\LoginRequest;
use App\Http\Resources\API\Customer\User\UserResource;
use App\Models\User;
use App\Services\Customer\CustomerProfileService;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends Controller
{
    use AuthenticatableWithAGS;

    public function login(LoginRequest $request): JsonResponse
    {
        if (! ($token = auth()->attempt($request->only('email', 'password')))) {
            $token = $this->loginAGS($request);
        }

        CustomerAuthenticated::dispatch(auth()->user(), $request->validated()['platform'] ?? null);

        return new JsonResponse(
            [
                'access_token' => $token,
                'type' => 'bearer',
                'expiry' => config('jwt.ttl'),
            ],
            Response::HTTP_OK,
        );
    }

    public function authenticateUserOnAgs(LoginRequest $request, CustomerProfileService $customerProfileService): JsonResponse
    {
        try{

            $response = $this->agsService->login(data: $request->validated());

            throw_if(!empty($response['code']), AuthenticationException::class);

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
            [ 'message' => 'User authenticated successfully.' ],
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
