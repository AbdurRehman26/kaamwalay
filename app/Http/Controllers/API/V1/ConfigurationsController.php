<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Services\ConfigurationService\ConfigurationService;
use Dompdf\Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

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
            $configurationService->invalidateConfigurations();
        } catch (Exception $e) {
            // We don't care if the invalidation fails
            Log::error($e->getMessage(), ['trace' => $e->getTraceAsString()]);
        }

        return new JsonResponse([
            'data' => [
                'message' => 'OK',
            ],
        ]);
    }
}
