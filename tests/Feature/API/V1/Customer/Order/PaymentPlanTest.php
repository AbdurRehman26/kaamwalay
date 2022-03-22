<?php

use App\Models\PaymentPlan;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('a user can see payment plans', function () {
    $this->actingAs($this->user);
    $response = $this->getJson('/api/v1/customer/orders/payment-plans/');

    $response->assertJsonCount(7, 'data');
    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'price', 'price_before_discount', 'discount_percentage', 'max_protection_amount', 'turnaround'],
        ],
    ]);
});

test('a user can see specific payment plan', function () {
    $this->actingAs($this->user);

    PaymentPlan::factory()
        ->count(1)
        ->create();
    $response = $this->getJson('/api/v1/customer/orders/payment-plans/1');

    $response->assertJsonCount(6, 'data');
    $response->assertJsonStructure([
        'data' => ['id', 'price', 'price_before_discount', 'discount_percentage', 'max_protection_amount', 'turnaround'],
    ]);
});

test('a guest can get payment plans', function () {
    $response = $this->getJson('/api/v1/customer/orders/payment-plans');

    $response->assertOk();
});
