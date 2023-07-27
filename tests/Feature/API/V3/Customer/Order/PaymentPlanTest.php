<?php

use App\Models\PaymentPlan;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('a user can see payment plans', function () {
    $this->actingAs($this->user);
    $response = $this->getJson(route('v3.payment-plans.index'));

    $response->assertJsonCount(7, 'data');
    $response->assertJsonStructure([
        'data' => [
            '*' => [
                'id',
                'price',
                'price_before_discount',
                'discount_percentage',
                'max_protection_amount',
                'turnaround',
                'price_ranges' => ['*' => ['id', 'min_cards', 'max_cards', 'price']],
                'min_price',
                'max_price',
            ],
        ],
    ]);
});

test('a user can see specific payment plan', function () {
    $this->actingAs($this->user);

    PaymentPlan::factory()
        ->count(1)
        ->create();
    $response = $this->getJson(route('v3.payment-plans.show', 1));

    $response->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                'id',
                'price',
                'price_before_discount',
                'discount_percentage',
                'max_protection_amount',
                'turnaround',
                'price_ranges' => ['*' => ['id', 'min_cards', 'max_cards', 'price']],
                'min_price',
                'max_price',
            ],
        ]);
});

test('a guest can get payment plans', function () {
    $response = $this->getJson(route('v3.payment-plans.index'));

    $response->assertOk();
});
