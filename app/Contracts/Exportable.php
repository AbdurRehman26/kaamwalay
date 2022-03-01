<?php

namespace App\Contracts;

use Illuminate\Support\Collection;

interface Exportable
{
    public static function exportCollection(): Collection;
    public static function exportHeadings(): array;
    public static function exportFilters(): array;
}
