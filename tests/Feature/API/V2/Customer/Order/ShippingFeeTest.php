<?php

use App\Models\ShippingMethod;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('a user can get shipping fee', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/v2/customer/orders/shipping-fee/', [
        'items' => [
            [
                'quantity' => 1,
                'declared_value_per_unit' => 500,
            ],
            [
                'quantity' => 2,
                'declared_value_per_unit' => 1000,
            ],
        ],
    ]);

    $response->assertJsonStructure([
        'data' => ['shipping_fee'],
    ]);
});

test('shipping fee needs items', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/v2/customer/orders/shipping-fee/');

    $response->assertJsonValidationErrors([
        'items' => 'The items field is required.',
    ]);
});

test('a guest can get shipping fee', function () {
    $response = $this->postJson('/api/v2/customer/orders/shipping-fee/', [
        'items' => [
            [
                'quantity' => 1,
                'declared_value_per_unit' => 500,
            ],
            [
                'quantity' => 2,
                'declared_value_per_unit' => 1000,
            ],
        ],
    ]);

    $response->assertJsonStructure([
        'data' => ['shipping_fee'],
    ]);
});

test('shipping fee is calculated based on provided shipping method', function (ShippingMethod $shippingMethod) {
    $this->postJson('/api/v2/customer/orders/shipping-fee', [
        'items' => [
            [
                'quantity' => 1,
                'declared_value_per_unit' => 500,
            ],
            [
                'quantity' => 2,
                'declared_value_per_unit' => 1000,
            ],
        ],
        'shipping_method_id' => $shippingMethod->id,
    ])->assertJsonFragment([
        'shipping_fee' => $shippingMethod->code === ShippingMethod::VAULT_STORAGE ? 0 : 29,
    ]);
})->with([
    fn () => (ShippingMethod::factory()->insured()->create()),
    fn () => (ShippingMethod::factory()->vault()->create()),
]);
