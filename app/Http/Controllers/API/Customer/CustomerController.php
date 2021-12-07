<?php

namespace App\Http\Controllers\API\Customer;

use App\Exceptions\API\Customer\CustomerProfileNotUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\UpdateCustomerRequest;
use App\Http\Resources\API\Customer\User\UserResource;
use App\Models\User;
use App\Services\Customer\CustomerProfileService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CustomerController extends Controller
{
    public function update(UpdateCustomerRequest $request, CustomerProfileService $customerProfileService): JsonResponse|UserResource
    {
        $data = $request->safe()->only([
            'first_name',
            'last_name',
            'username',
            'password',
            'phone',
            'email_subscription',
            'profile_image'
        ]);

        /** @var User $user */
        $user = auth()->user();

        try {
            return new UserResource($customerProfileService->update($user, $data));
        } catch (CustomerProfileNotUpdated $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }
}
