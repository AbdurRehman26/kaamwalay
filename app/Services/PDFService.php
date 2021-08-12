<?php

namespace App\Services;

use App\Models\Order;
use App\Services\Order\Shipping\Calculators\InsuredShippingFeeCalculator;

class PDFService
{
    public static function generate(string $viewName, array $data)
    {
        $pdf = \PDF::loadView($viewName,$data);
        $pdf->setPaper('A4');
        return $pdf;
    }
}
