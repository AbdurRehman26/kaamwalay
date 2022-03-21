<?php

namespace App\Http\Controllers\API\V2;

use App\Contracts\Exportable;
use App\Exceptions\Services\Admin\ModelNotExportableException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\ExportDataRequest;
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
        $url = $this->dataExportService->process(
            $this->getModelInstance($request->validated('model'))
        );

        return new JsonResponse(['data' => ['file_url' => $url]]);
    }

    /**
     * @throws ModelNotExportableException
     */
    protected function getModelInstance(string $model): Exportable
    {
        $class = '\\App\\Models\\' . ucfirst($model);
        $instance = new $class;

        if (! $instance instanceof Exportable) {
            throw new ModelNotExportableException();
        }

        return $instance;
    }
}
