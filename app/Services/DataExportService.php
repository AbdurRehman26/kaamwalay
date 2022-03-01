<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\QueryBuilder\QueryBuilder;

class DataExportService implements FromQuery, WithHeadings
{
    const DIRECTORY = 'exports';

    protected Model $model;

    public function process(string $model): string
    {
        $this->model = $this->getModelInstance($model);

        $filePath = $this->generateFilePath($model);
        Excel::store($this, $filePath, 's3', \Maatwebsite\Excel\Excel::CSV);

        return Storage::disk('s3')->url($filePath);
    }

    public function query(): Relation|EloquentBuilder|Builder
    {
        return QueryBuilder::for(get_class($this->model))
            ->allowedFilters($this->model::exportFilters());
    }

    public function headings(): array
    {
        return $this->model::exportHeadings();
    }

    protected function generateFilePath(string $model): string
    {
        return self::DIRECTORY . '/' . $model . '-' . now()->toDateString() . '-' . Str::uuid() . '.csv';
    }

    protected function getModelInstance(string $model): ?Model
    {
        if ($model == 'order') {
            return new Order;
        }

        return null;
    }
}
