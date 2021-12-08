<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\UpdateCustomerRequest;
use App\Http\Resources\API\Customer\User\UserResource;
use App\Models\User;
use App\Services\Customer\CustomerProfileService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Exception;

class CustomerController extends Controller
{
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
