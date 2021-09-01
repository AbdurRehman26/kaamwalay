<?php

use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('a customer can get payment methods', function () {
    $this->actingAs($this->user);
    $response = $this->getJson('/api/customer/orders/payment-methods');

    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'code', 'name'],
        ],
    ]);
});

test('a customer can get specific payment method', function () {
    $this->actingAs($this->user);
    $response = $this->getJson('/api/customer/orders/payment-methods/1');

    $response->assertJsonStructure([
        'data' => ['id', 'code', 'name'],
    ]);
});

test('a guest cannot get payment methods', function () {
    $response = $this->getJson('/api/customer/orders/payment-methods');

    $response->assertUnauthorized();
});
