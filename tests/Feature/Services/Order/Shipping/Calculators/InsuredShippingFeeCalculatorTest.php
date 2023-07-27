<?php

use App\Models\Country;
use App\Services\Order\Shipping\Calculators\InsuredShippingFeeCalculator;

beforeEach(function () {
    $this->canada = Country::whereCode('CA')->first();

    $this->sampleRequestRatesResponse = json_decode(file_get_contents(
        base_path().'/tests/stubs/EasyShip_usa_to_canada_box_response.json'
    ), associative: true);

    $this->sampleMissingRatesResponse = json_decode(file_get_contents(
        base_path().'/tests/stubs/EasyShip_missing_rates_response.json'
    ), associative: true);

    $this->wrongPermissionsResponse = json_decode(file_get_contents(
        base_path().'/tests/stubs/EasyShip_wrong_permissions_response.json'
    ), associative: true);
});

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

test('international insured shipping fee is calculated correctly', function () {
    Http::fake([
        '*/api.easyship.com/*' => Http::response($this->sampleRequestRatesResponse, 200, []),
    ]);

    $rate = InsuredShippingFeeCalculator::calculate(42, 42, [
        'first_name' => 'test',
        'last_name' => 'test',
        'address' => '1234 test St',
        'address_2' => 'Lorem',
        'city' => 'Vancouver',
        'state' => 'British Columbia',
        'zip' => '123 ABC',
        'phone' => '132-456-7890',
        'flat' => '',
        'save_for_later' => true,
        'country_code' => 'CA',
    ]);

    expect($rate)->toBe(98.77);
});

test('international insured shipping fee returns default value on missing rates', function () {
    Http::fake([
        '*/api.easyship.com/*' => Http::response($this->sampleMissingRatesResponse, 200, []),
    ]);

    $rate = InsuredShippingFeeCalculator::calculate(42, 42, [
        'first_name' => 'test',
        'last_name' => 'test',
        'address' => '1234 test St',
        'address_2' => 'Lorem',
        'city' => 'Vancouver',
        'state' => 'British Columbia',
        'zip' => '123 ABC',
        'phone' => '132-456-7890',
        'flat' => '',
        'save_for_later' => true,
        'country_code' => 'CA',
    ]);

    expect($rate)->toBe($this->canada->shippingMatrix->box_default_value);
});

test('international insured shipping fee returns default value on error', function () {
    Http::fake([
        '*/api.easyship.com/*' => Http::response($this->wrongPermissionsResponse, 200, []),
    ]);

    $rate = InsuredShippingFeeCalculator::calculate(42, 42, [
        'first_name' => 'test',
        'last_name' => 'test',
        'address' => '1234 test St',
        'address_2' => 'Lorem',
        'city' => 'Vancouver',
        'state' => 'British Columbia',
        'zip' => '123 ABC',
        'phone' => '132-456-7890',
        'flat' => '',
        'save_for_later' => true,
        'country_code' => 'CA',
    ]);

    expect($rate)->toBe($this->canada->shippingMatrix->box_default_value);
});
