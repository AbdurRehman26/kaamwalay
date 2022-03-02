<?php

namespace App\Services\Admin;

use App\Contracts\Exportable;
use App\Exceptions\Services\Admin\ModelNotExportableException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\QueryBuilder\QueryBuilder;

class DataExportService implements FromQuery, WithHeadings, WithMapping
{
    const DIRECTORY = 'exports';

    protected Exportable $model;

    /**
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     * @throws \PhpOffice\PhpSpreadsheet\Writer\Exception
     * @throws ModelNotExportableException
     */
    public function process(string $model): string
    {
        $this->model = $this->getModelInstance($model);

        $filePath = $this->generateFilePath($model);
        Excel::store($this, $filePath, 's3', \Maatwebsite\Excel\Excel::CSV);

        return Storage::disk('s3')->url($filePath);
    }

    /**
     * @return QueryBuilder
     * @phpstan-ignore-next-line
     */
    public function query(): QueryBuilder
    {
        return QueryBuilder::for($this->model->exportQuery())
            ->allowedFilters($this->model->exportFilters())
            ->allowedIncludes($this->model->exportIncludes());
    }

    public function headings(): array
    {
        return $this->model->exportHeadings();
    }

    public function map($row): array
    {
        return $this->model->exportMap($row);
    }

    protected function generateFilePath(string $model): string
    {
        return self::DIRECTORY . '/' . $model . '-' . now()->toDateString() . '-' . Str::uuid() . '.csv';
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
