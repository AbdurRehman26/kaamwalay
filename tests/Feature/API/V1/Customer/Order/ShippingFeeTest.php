<?php

use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('a user can get shipping fee', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/customer/orders/shipping-fee/', [
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

    $response = $this->postJson('/api/customer/orders/shipping-fee/');

    $response->assertJsonValidationErrors([
        'items' => 'The items field is required.',
    ]);
});

test('a guest cannot get shipping fee', function () {
    $response = $this->postJson('/api/customer/orders/shipping-fee/');

    $response->assertUnauthorized();
});
