<?php

namespace App\Http\Controllers\API\V2\Customer;

use App\Http\Controllers\API\V1\Customer\ProfileController as V1ProfileController;
use App\Services\CustomerProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends V1ProfileController
{
    public function deactivateProfile(Request $request, CustomerProfileService $customerProfileService): JsonResponse
    {
        $success = $customerProfileService->deactivateProfile($request->user());

        auth()->logout();

        return response()->json(compact('success'));
    }

    public function deleteProfile(Request $request, CustomerProfileService $customerProfileService): JsonResponse
    {
        $success = $customerProfileService->deleteProfile($request->user());

        auth()->logout();

        return response()->json(compact('success'));
    }
}
