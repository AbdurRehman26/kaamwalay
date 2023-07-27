<?php

namespace App\Http\Controllers\API\V2\Customer;

use App\Exceptions\API\Auth\AgsAuthenticationException;
use App\Exceptions\API\Customer\UserAccountCannotBeDeactivatedException;
use App\Exceptions\API\Customer\UserAccountCannotBeDeletedException;
use App\Http\Controllers\API\V1\Customer\ProfileController as V1ProfileController;
use App\Http\Requests\API\V2\Customer\Profile\ToggleMarketingNotificationsRequest;
use App\Http\Resources\API\V2\Customer\User\UserResource;
use App\Models\User;
use App\Services\CustomerProfileService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ProfileController extends V1ProfileController
{
    /**
     * @throws UserAccountCannotBeDeactivatedException
     * @throws Throwable
     */
    public function deactivateProfile(Request $request, CustomerProfileService $customerProfileService): JsonResponse
    {
        throw_if(! $request->user()->ags_access_token, AgsAuthenticationException::class);

        $success = $customerProfileService->deactivateProfile($request->user());

        auth()->logout();

        return response()->json(compact('success'));
    }

    /**
     * @throws UserAccountCannotBeDeletedException
     * @throws Throwable
     */
    public function deleteProfile(Request $request, CustomerProfileService $customerProfileService): JsonResponse
    {
        throw_if(! $request->user()->ags_access_token, AgsAuthenticationException::class);

        $success = $customerProfileService->deleteProfile($request->user());

        auth()->logout();

        return response()->json(compact('success'));
    }

    public function toggleMarketingNotifications(ToggleMarketingNotificationsRequest $request, CustomerProfileService $customerProfileService): JsonResponse|UserResource
    {
        try {
            $data = $request->safe()->only([
                'is_marketing_notifications_enabled',
            ]);

            /** @var User $user */
            $user = auth()->user();

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
