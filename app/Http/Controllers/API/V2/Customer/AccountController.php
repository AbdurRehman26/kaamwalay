<?php

namespace App\Http\Controllers\API\V2\Customer;

use App\Http\Controllers\Controller;
use App\Services\CustomerProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function deactivateAccount(Request $request, CustomerProfileService $customerProfileService): JsonResponse
    {
        $success = $customerProfileService->deactivateAccount($request->user());

        auth()->logout();

        return response()->json(compact('success'));
    }

    public function deleteAccount(Request $request, CustomerProfileService $customerProfileService): JsonResponse
    {
        $success = $customerProfileService->deleteAccount($request->user());

        auth()->logout();

        return response()->json(compact('success'));
    }
}
