<?php

namespace App\Services\SerialNumberService;

use Illuminate\Database\Query\Expression;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SerialNumber
{
    private ?int $value;

    public function __construct(
        private string $prefix,
        private int    $length = 8,
        private string $padding = '0',
    ) {
    }

    private function build(): string
    {
        return ($this->prefix ?? '') . Str::padLeft($this->value, $this->length, $this->padding);
    }

    public function setValue(?int $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function toString(): string
    {
        return $this->build();
    }

    public function __toString()
    {
        return $this->toString();
    }

    public function toSql($column = 'id'): Expression
    {
        return DB::raw("CONCAT('$this->prefix', LPAD(`$column`, $this->length, '$this->padding'))");
    }
}
