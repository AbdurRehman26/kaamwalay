<?php

namespace App\Http\Controllers\API\V2\Customer;

use App\Exceptions\API\Auth\AgsAuthenticationException;
use App\Http\Controllers\API\V1\Customer\ProfileController as V1ProfileController;
use App\Services\CustomerProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends V1ProfileController
{
    /**
     * @throws AgsAuthenticationException
     */
    public function deactivateProfile(Request $request, CustomerProfileService $customerProfileService): JsonResponse
    {
        throw_if(! $request->user()->ags_access_token, AgsAuthenticationException::class);

        $success = $customerProfileService->deactivateProfile($request->user());

        auth()->logout();

        return response()->json(compact('success'));
    }

    /**
     * @throws AgsAuthenticationException
     */
    public function deleteProfile(Request $request, CustomerProfileService $customerProfileService): JsonResponse
    {
        throw_if(! $request->user()->ags_access_token, AgsAuthenticationException::class);

        $success = $customerProfileService->deleteProfile($request->user());

        auth()->logout();

        return response()->json(compact('success'));
    }
}
