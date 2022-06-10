<?php

use App\Models\Country;
use App\Services\Order\Shipping\Calculators\InternationalInsuredShippingFeeCalculator;

beforeEach(function () {
    $this->canada = Country::whereCode('CA')->first();

    $this->sampleRequestRatesResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/EasyShip_usa_to_canada_box_response.json'
    ), associative: true);

    $this->sampleMissingRatesResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/EasyShip_missing_rates_response.json'
    ), associative: true);

    $this->wrongPermissionsResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/EasyShip_wrong_permissions_response.json'
    ), associative: true);
});

test('international insured shipping fee is calculated correctly', function () {
    Http::fake([
        '*/api.easyship.com/*' => Http::response($this->sampleRequestRatesResponse, 200, []),
    ]);

    $rate = InternationalInsuredShippingFeeCalculator::calculate(42, [
        "first_name" => "test",
        "last_name" => "test",
        "address" => "1234 test St",
        "address_2" => "Lorem",
        "city" => "Vancouver",
        "state" => "British Columbia",
        "zip" => "123 ABC",
        "phone" => "132-456-7890",
        "flat" => "",
        "save_for_later" => true,
        "country_code" => "CA",
    ]);

    expect($rate)->toBe(98.77);
});

test('international insured shipping fee returns default value on missing rates', function () {
    Http::fake([
        '*/api.easyship.com/*' => Http::response($this->sampleMissingRatesResponse, 200, []),
    ]);

    $rate = InternationalInsuredShippingFeeCalculator::calculate(42, [
        "first_name" => "test",
        "last_name" => "test",
        "address" => "1234 test St",
        "address_2" => "Lorem",
        "city" => "Vancouver",
        "state" => "British Columbia",
        "zip" => "123 ABC",
        "phone" => "132-456-7890",
        "flat" => "",
        "save_for_later" => true,
        "country_code" => "CA",
    ]);

    expect($rate)->toBe($this->canada->shippingMatrix->box_default_value);
});

test('international insured shipping fee returns default value on error', function () {
    Http::fake([
        '*/api.easyship.com/*' => Http::response($this->wrongPermissionsResponse, 200, []),
    ]);

    $rate = InternationalInsuredShippingFeeCalculator::calculate(42, [
        "first_name" => "test",
        "last_name" => "test",
        "address" => "1234 test St",
        "address_2" => "Lorem",
        "city" => "Vancouver",
        "state" => "British Columbia",
        "zip" => "123 ABC",
        "phone" => "132-456-7890",
        "flat" => "",
        "save_for_later" => true,
        "country_code" => "CA",
    ]);

    expect($rate)->toBe($this->canada->shippingMatrix->box_default_value);
});
