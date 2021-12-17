<?php

namespace App\Http\Controllers\API\Customer;

use App\Exceptions\API\Auth\AgsAuthenticationException;
use App\Exceptions\API\Customer\InvalidAgsDataForCustomer;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\UpdateCustomerRequest;
use App\Http\Resources\API\Customer\User\UserResource;
use App\Models\User;
use App\Services\AGS\AgsService;
use App\Services\CustomerProfileService;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ProfileController extends Controller
{
    /**
     * @throws \Throwable
     */
    public function update(UpdateCustomerRequest $request, CustomerProfileService $customerProfileService, AgsService $agsService): JsonResponse|UserResource
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

            throw_if(! $user->ags_access_token, AgsAuthenticationException::class);

            $response = $agsService->updateUserData($user->ags_access_token, $data);

            if (! empty($response['code'])) {
                throw_if($response['code'] === Response::HTTP_BAD_REQUEST, new InvalidAgsDataForCustomer($response['message'], Response::HTTP_UNPROCESSABLE_ENTITY));
                throw_if($response['code'] === Response::HTTP_UNAUTHORIZED, AgsAuthenticationException::class);
            }

            $userResponse = $customerProfileService->update($user, $data);
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                $e->getCode()
            );
        }

        return new UserResource($userResponse);
    }
}
