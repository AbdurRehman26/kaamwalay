<?php

namespace App\Services;

use CodeItNow\BarcodeBundle\Utils\BarcodeGenerator;

class BarcodeService
{
    public static function generate(string $text, string $type, string $label, int $scale): string
    {
        $barCode = new BarcodeGenerator();
        $barCode->setText($text);
        $barCode->setType($type);
        $barCode->setLabel($label);
        $barCode->setScale($scale);

        return $barCode->generate();
    }
}
