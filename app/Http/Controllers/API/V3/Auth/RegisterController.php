<?php

namespace App\Http\Controllers\API\V3\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Events\API\Auth\UserLoggedIn;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Auth\RegisterRequest;
use App\Jobs\Auth\CreateUserDeviceJob;
use App\Models\Referrer;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use App\Services\Referrer\ReferrerService;

class RegisterController extends Controller
{
    public function __construct(protected ReferrerService $referrerService) {

    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::createCustomer($request->validated());

        CustomerRegistered::dispatch($user, $request->only('password', 'platform', 'app_generated_id'));

        $token = auth()->guard()->login($user);

        UserLoggedIn::dispatch($user);

        CreateUserDeviceJob::dispatch(auth()->user(), $request->validated()['platform'] ?? null);

        if (array_key_exists('referral_code', $request->validated())) {
            $this->referrerService->increaseSuccessfulSignups(Referrer::where('referral_code', $request->referral_code)->first());
        }

        return new JsonResponse([
            'access_token' => $token,
            'type' => 'bearer',
            'expiry' => config('jwt.ttl'),
        ], Response::HTTP_CREATED);
    }
}
