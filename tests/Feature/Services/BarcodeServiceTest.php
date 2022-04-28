<?php

use App\Services\BarcodeService;

it('can generate barcode', function () {
    $barcode = BarcodeService::generate('RG000000001');

    expect($barcode)->toBeString();
});
