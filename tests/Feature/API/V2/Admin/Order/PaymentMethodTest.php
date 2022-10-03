<?php

use App\Models\PaymentMethod;
use App\Models\User;
use Database\Seeders\RolesSeeder;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->actingAs($this->user);
});

test('an admin can get payment methods', function () {
    $response = $this->getJson('/api/v2/admin/orders/payment-methods');

    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'code', 'name'],
        ],
    ]);
});

test('an admin can get specific payment method', function () {
    $response = $this->getJson('/api/v2/admin/orders/payment-methods/1');

    $response->assertJsonStructure([
        'data' => ['id', 'code', 'name'],
    ]);
});
