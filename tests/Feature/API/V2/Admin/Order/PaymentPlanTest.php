<?php

use App\Models\PaymentPlan;
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

test('an admin can see payment plans', function () {
    $response = $this->getJson('/api/v2/admin/orders/payment-plans/');

    $response->assertJsonCount(7, 'data');
    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'price', 'price_before_discount', 'discount_percentage', 'max_protection_amount', 'turnaround'],
        ],
    ]);
});

test('an admin can see specific payment plan', function () {
    PaymentPlan::factory()
        ->count(1)
        ->create();
    $response = $this->getJson('/api/v2/admin/orders/payment-plans/1');

    $response->assertJsonCount(6, 'data');
    $response->assertJsonStructure([
        'data' => ['id', 'price', 'price_before_discount', 'discount_percentage', 'max_protection_amount', 'turnaround'],
    ]);
});
