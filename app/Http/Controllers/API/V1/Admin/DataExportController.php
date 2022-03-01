<?php

namespace App\Http\Controllers\API\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Admin\ExportDataRequest;
use App\Services\DataExportService;
use Illuminate\Http\JsonResponse;

class DataExportController extends Controller
{
    public function __construct(protected DataExportService $dataExportService)
    {
    }

    /**
     * Handle the incoming request.
     *
     * @param  ExportDataRequest  $request
     * @return JsonResponse
     */
    public function __invoke(ExportDataRequest $request)
    {
        $url = $this->dataExportService->process($request->validated('model'));

        return new JsonResponse(['data' => ['url' => $url]]);
    }
}
