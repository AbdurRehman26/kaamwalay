<?php

namespace App\Services\Order;

use Illuminate\Support\Str;

class OrderNumberGeneratorService
{
    protected const PREFIX = 'RG';

    public static function generate(): string
    {
        $number = rand(1, 999999999);

        return self::PREFIX . Str::padLeft($number, 9, '0');
    }
}
