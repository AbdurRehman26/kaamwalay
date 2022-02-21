<?php

use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('a customer can get shipping methods', function () {
    $this->actingAs($this->user);
    $response = $this->getJson('/api/v2/customer/orders/shipping-methods');

    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'code', 'name'],
        ],
    ]);
});

test('a customer can get specific shipping method', function () {
    $this->actingAs($this->user);
    $response = $this->getJson('/api/v2/customer/orders/shipping-methods/1');

    $response->assertJsonStructure([
        'data' => ['id', 'code', 'name'],
    ]);
});

test('a guest cannot get shipping methods', function () {
    $response = $this->getJson('/api/v2/customer/orders/shipping-methods');

    $response->assertUnauthorized();
});
