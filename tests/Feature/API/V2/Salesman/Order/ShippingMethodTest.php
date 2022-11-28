<?php

use App\Models\User;
use Database\Seeders\RolesSeeder;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()
        ->withSalesmanRole()
        ->create();

    $this->actingAs($this->user);
});

test('an salesman can get shipping methods', function () {
    $this->actingAs($this->user);
    $response = $this->getJson('/api/v2/salesman/orders/shipping-methods');

    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'code', 'name'],
        ],
    ]);
});

test('an salesman can get specific shipping method', function () {
    $this->actingAs($this->user);
    $response = $this->getJson('/api/v2/salesman/orders/shipping-methods/1');

    $response->assertJsonStructure([
        'data' => ['id', 'code', 'name'],
    ]);
});
