<?php

namespace App\Services;

use Picqer\Barcode\BarcodeGenerator;
use Picqer\Barcode\BarcodeGeneratorPNG;

class BarcodeService
{
    public static function generate(string $text): string
    {
        $barCode = new BarcodeGeneratorPNG();

        return base64_encode($barCode->getBarcode($text, BarcodeGenerator::TYPE_CODE_39, 2, 70));
    }
}
