<?php

use App\Models\PaymentMethod;
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

test('a customer can see only enabled payment methods', function () {
    $paypalPaymentMethod = tap(PaymentMethod::where('code', 'paypal')->first())->update(['is_enabled' => 0]);
    $paymentMethodsCount = PaymentMethod::where('is_enabled', 1)->count();

    $this->actingAs($this->user);
    $response = $this->getJson('/api/customer/orders/payment-methods');

    $response->assertJsonCount($paymentMethodsCount, ['data']);
    $response->assertJsonMissing([
        'id' => $paypalPaymentMethod->id,
        'code' => $paypalPaymentMethod->code,
        'name' => $paypalPaymentMethod->name,
    ]);
});
