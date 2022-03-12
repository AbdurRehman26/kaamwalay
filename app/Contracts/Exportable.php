<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

interface Exportable
{
    /** @phpstan-ignore-next-line  */
    public function exportQuery(): Builder;
    public function exportHeadings(): array;
    public function exportFilters(): array;
    public function exportIncludes(): array;
    public function exportRowMap(Model $row): array;
}
