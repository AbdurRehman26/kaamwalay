<?php

namespace App\Http\Controllers\API\V1\Admin;

use App\Exceptions\Services\Admin\ModelNotExportableException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Admin\ExportDataRequest;
use App\Services\Admin\DataExportService;
use Illuminate\Http\JsonResponse;

class DataExportController extends Controller
{
    public function __construct(protected DataExportService $dataExportService)
    {
    }

    /**
     * @param  ExportDataRequest  $request
     * @return JsonResponse
     * @throws ModelNotExportableException
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     * @throws \PhpOffice\PhpSpreadsheet\Writer\Exception
     */
    public function __invoke(ExportDataRequest $request)
    {
        $url = $this->dataExportService->process($request->validated('model'));

        return new JsonResponse(['data' => ['file_url' => $url]]);
    }
}
