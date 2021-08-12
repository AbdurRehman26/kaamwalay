<?php

namespace App\Services\Order;

use App\Models\Order;
use Illuminate\Support\Str;

class OrderNumberGeneratorService
{
    protected const PREFIX = 'RG';

    public static function generate(Order $order): string
    {
        return self::PREFIX . Str::padLeft($order->id, 9, '0');
    }
}
