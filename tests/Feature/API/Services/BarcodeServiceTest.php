<?php

use App\Services\BarcodeService;
use CodeItNow\BarcodeBundle\Utils\BarcodeGenerator;

it('can generate barcode', function () {
    $barcode = BarcodeService::generate('RG000000001', BarcodeGenerator::Code39, '', 2);

    expect($barcode)->toBeString();
});
