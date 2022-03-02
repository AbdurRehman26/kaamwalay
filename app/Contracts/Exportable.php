<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

interface Exportable
{
    /**
     * @return Builder <Model>
     */
    public function exportQuery(): Builder;
    public function exportHeadings(): array;
    public function exportFilters(): array;
    public function exportIncludes(): array;
    public function exportMap(Model $row): array;
}
