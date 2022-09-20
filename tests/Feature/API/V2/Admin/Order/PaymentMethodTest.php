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

test('an admin can see only enabled payment methods', function () {
    $paypalPaymentMethod = tap(PaymentMethod::where('code', 'paypal')->first())->update(['is_enabled' => 0]);
    $paymentMethodsCount = PaymentMethod::enabled()->visible()->count();

    $response = $this->getJson('/api/v2/admin/orders/payment-methods');

    $response->assertJsonCount($paymentMethodsCount, ['data']);
    $response->assertJsonMissing([
        'id' => $paypalPaymentMethod->id,
        'code' => $paypalPaymentMethod->code,
        'name' => $paypalPaymentMethod->name,
    ]);
});
