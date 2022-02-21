<?php

use App\Models\Coupon;
use App\Models\Couponable;
use App\Models\CouponApplicable;
use App\Models\CouponStatus;
use App\Models\PaymentPlan;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

beforeEach(function () {
    $this->paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => 300]);

    CouponStatus::factory()->count(2)->create();

    $couponApplicable = CouponApplicable::factory()
        ->create(
            [
                'code' => CouponApplicable::FOR_PAYMENT_PLANS,
                'label' => 'Payments',
                'is_active' => 1,
            ]
        );

    $this->coupon = Coupon::factory()
        ->create(
            [
                'coupon_applicable_id' => $couponApplicable->id,
                'coupon_status_id' => 2,
            ]
        );

    $this->couponable = Couponable::factory()
        ->create(
            [
                'coupon_id' => $this->coupon->id,
                'couponables_type' => Couponable::COUPONABLE_TYPES['service_level'],
                'couponables_id' => $this->paymentPlan->id,

            ]
        );

    $this->user = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create();
});


test('customer checks for valid coupon', function () {
    actingAs($this->user);

    getJson(route('v1.coupon.verify', [
            $this->coupon->code,
            'couponables_type' => 'service_level',
            'couponables_id' => $this->paymentPlan->id,
        ]))
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'id',
                'code',
                'discount_statement',
            ],
        ]);
});

test('customer checks for invalid coupon code', function () {
    actingAs($this->user);

    getJson(route('v1.coupon.verify', $this->coupon->code . 'test'))
        ->assertStatus(422);
});

test('customer checks for valid coupon code on wrong service level', function () {
    actingAs($this->user);

    getJson(route('v1.coupon.verify', [
        $this->coupon->code,
        'couponables_type' => 'service_level',
        'couponables_id' => 100,
    ]))
        ->assertStatus(422);
});
