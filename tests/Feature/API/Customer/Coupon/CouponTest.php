<?php

use App\Models\Coupon;
use App\Models\Couponable;
use App\Models\User;

beforeEach(function () {
    $this->coupon = Coupon::factory()->count(5)->create();
    $this->couponables = Couponable::factory()->count(2)->create();
    $this->user = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create();

    $this->actingAs($this->user);
});


test('customer checks for valid coupon', function () {
    $this->actingAs($this->user);
    dd($this->coupon);
    $response = $this->getJson('/api/customer/coupons/' . $this->coupon->code, [
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
        'shipping_method' => [
            'id' => $this->shippingMethod->id,
        ],
        'payment_method' => [
            'id' => $this->paymentMethod->id,
        ],
        'payment_provider_reference' => [
            'id' => '12345678',
        ],
    ]);

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'id',
            'order_number',
            'order_items',
            'payment_plan',
            'order_payment',
            'billing_address',
            'shipping_address',
            'shipping_method',
            'service_fee',
            'shipping_fee',
            'grand_total',
        ],
    ]);
});
