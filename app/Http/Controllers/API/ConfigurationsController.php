<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\ConfigurationService;
use Dompdf\Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ConfigurationsController extends Controller
{
    public function getConfigurations(ConfigurationService $configurationService): JsonResponse
    {
        return new JsonResponse([
            'data' => $configurationService->getAllConfigurations(),
        ]);
    }

    public function purgeConfigurations(ConfigurationService $configurationService): JsonResponse
    {
        abort_unless(auth()->user()->isAdmin(), Response::HTTP_FORBIDDEN, "You don't have permissions to perform this action!");

        try {
            $storeName = request('store', 'all');
            $configurationService->invalidateConfigurations($storeName);
        } catch (Exception $e) {
            // We don't care if the invalidation fails
        }

        return new JsonResponse([
            'data' => [
                'message' => 'OK',
            ],
        ]);
    }
}
