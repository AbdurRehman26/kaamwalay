<?php

namespace App\Contracts;

interface ExportableWithSort
{
    public function exportSort(): array;
}
