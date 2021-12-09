<?php

namespace App\Http\Controllers\API\Customer;

use App\Exceptions\API\Auth\AgsAuthenticationException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\UpdateCustomerRequest;
use App\Http\Resources\API\Customer\User\UserResource;
use App\Models\User;
use App\Services\Customer\CustomerProfileService;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CustomerController extends Controller
{
    /**
     * @throws \Throwable
     */
    public function update(UpdateCustomerRequest $request, CustomerProfileService $customerProfileService): JsonResponse|UserResource
    {
        try {
            $data = $request->safe()->only([
                'first_name',
                'last_name',
                'username',
                'phone',
                'profile_image',
            ]);

            /** @var User $user */
            $user = auth()->user();

            throw_if(!$user->ags_access_token, AgsAuthenticationException::class);

            $userResponse = $customerProfileService->update($user, $data);

        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return new UserResource($userResponse);
    }
}
