<?php

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

test('an admin can get shipping methods', function () {
    $this->actingAs($this->user);
    $response = $this->getJson('/api/v2/admin/orders/shipping-methods');

    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'code', 'name'],
        ],
    ]);
});

test('an admin can get specific shipping method', function () {
    $this->actingAs($this->user);
    $response = $this->getJson('/api/v2/admin/orders/shipping-methods/1');

    $response->assertJsonStructure([
        'data' => ['id', 'code', 'name'],
    ]);
});
