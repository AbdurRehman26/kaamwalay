<?php

namespace App\Http\Controllers\API\V2\Customer;

use App\Exceptions\API\FeatureNotAvailable;
use App\Http\Controllers\API\V1\Customer\ProfileController as V1ProfileController;
use App\Services\CustomerProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends V1ProfileController
{
    /**
     * @throws FeatureNotAvailable
     */
    public function deactivateProfile(Request $request, CustomerProfileService $customerProfileService): JsonResponse
    {
        throw new FeatureNotAvailable('Coming Soon');

        /*$success = $customerProfileService->deactivateProfile($request->user());

        auth()->logout();

        return response()->json(compact('success'));*/
    }

    /**
     * @throws FeatureNotAvailable
     */
    public function deleteProfile(Request $request, CustomerProfileService $customerProfileService): JsonResponse
    {
        throw new FeatureNotAvailable('Coming Soon');

        /*$success = $customerProfileService->deleteProfile($request->user());

        auth()->logout();

        return response()->json(compact('success'));*/
    }
}
