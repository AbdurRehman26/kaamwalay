<?php

namespace App\Services\SerialNumberService;

use Illuminate\Support\Str;

class SerialNumber
{
    public function __construct(
        private string $prefix,
        private int    $length = 8,
        private string $padding = '0',
    ) {
    }

    public function build($value): string
    {
        return ($this->prefix ?? '') . Str::padLeft($value, $this->length, $this->padding);
    }
}
