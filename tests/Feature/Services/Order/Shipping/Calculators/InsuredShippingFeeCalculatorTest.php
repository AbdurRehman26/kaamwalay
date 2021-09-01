<?php

use App\Services\Order\Shipping\Calculators\InsuredShippingFeeCalculator;

test('insured shipping fee is calculated correctly', function (float $expectedShippingFee, float $calculatedShippingFee) {
    expect($calculatedShippingFee)->toBe($expectedShippingFee);
})->with('insuredShippingFee');

// Datasets
dataset('insuredShippingFee', [
    'Basic shipping fee case' => [
        14.00,
        InsuredShippingFeeCalculator::calculate(200, 2),
    ],
    'Basic shipping fee case 2' => [
        151.00,
        InsuredShippingFeeCalculator::calculate(155000, 10),
    ],
    'Basic shipping fee case 3' => [
        63.00,
        InsuredShippingFeeCalculator::calculate(30000, 10),
    ],
    'Additional shipping fee case based on extra cards' => [
        20.50,
        InsuredShippingFeeCalculator::calculate(200, 27),
    ],
    'Additional shipping fee case based on extra declared value' => [
        171.00,
        InsuredShippingFeeCalculator::calculate(250000, 10),
    ],
    'Additional shipping fee case based on extra cards and declared value' => [
        172.00,
        InsuredShippingFeeCalculator::calculate(250000, 27),
    ],
]);
