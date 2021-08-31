<?php

use App\Models\PaymentPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('a user can see payment plans', function () {
    $this->actingAs($this->user);
    $response = $this->getJson('/api/customer/orders/payment-plans/');

    $response->assertJsonCount(7, 'data');
    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'price', 'max_protection_amount', 'turnaround'],
        ],
    ]);
});

test('a user can see specific payment plan', function () {
    $this->actingAs($this->user);

    PaymentPlan::factory()
        ->count(1)
        ->create();
    $response = $this->getJson('/api/customer/orders/payment-plans/1');

    $response->assertJsonCount(4, 'data');
    $response->assertJsonStructure([
        'data' => ['id', 'price', 'max_protection_amount', 'turnaround'],
    ]);
});

test('a guest cannot get payment plans', function () {
    $response = $this->getJson('/api/customer/orders/payment-plans');

    $response->assertUnauthorized();
});
