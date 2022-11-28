<?php

use App\Models\User;
use Database\Seeders\RolesSeeder;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()
        ->admin()
        ->withSalesmanRole()
        ->create();

    $this->actingAs($this->user);
});

test('a salesman can get payment methods', function () {
    $response = $this->getJson('/api/v2/salesman/orders/payment-methods');

    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'code', 'name'],
        ],
    ]);
});

test('an salesman can get specific payment method', function () {
    $response = $this->getJson('/api/v2/salesman/orders/payment-methods/1');

    $response->assertJsonStructure([
        'data' => ['id', 'code', 'name'],
    ]);
});
