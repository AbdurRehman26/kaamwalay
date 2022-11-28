<?php

use App\Enums\Coupon\CouponMinThresholdTypeEnum;
use App\Models\Coupon;
use App\Models\Couponable;
use App\Models\CouponApplicable;
use App\Models\CouponStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentPlan;
use App\Models\User;
use Database\Seeders\RolesSeeder;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->paymentPlan = PaymentPlan::factory()
        ->withPaymentPlanRanges()
        ->create(['max_protection_amount' => 300]);
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
        ->withSalesmanRole()
        ->create();
});


test('salesman checks for valid coupon', function () {
    actingAs($this->user);

    getJson(route('v2.salesman.coupon.verify', [
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

test('salesman checks for invalid coupon code', function () {
    actingAs($this->user);

    getJson(route('v2.salesman.coupon.verify', $this->coupon->code . 'test'))
        ->assertStatus(422);
});

test('salesman checks for valid coupon code on wrong service level', function () {
    actingAs($this->user);

    getJson(route('v2.salesman.coupon.verify', [
        $this->coupon->code,
        'couponables_type' => 'service_level',
        'couponables_id' => 100,
    ]))
        ->assertStatus(422);
});

test('salesman checks for valid coupon code having items less than required', function ($count) {
    actingAs($this->user);

    $couponable = CouponApplicable::first();

    $coupon = Coupon::factory()
        ->create(
            [
                'coupon_applicable_id' => $couponable->id,
                'coupon_status_id' => 2,
                'min_threshold_type' => CouponMinThresholdTypeEnum::CARD_COUNT,
                'min_threshold_value' => 10,
            ]
        );

    getJson(route('v2.salesman.coupon.verify', [
        $coupon->code,
        'couponables_type' => 'service_level',
        'couponables_id' => $couponable->id,
        'items_count' => 1,
    ]))
        ->assertStatus(422);
})->with([1, 3, 5, 9]);

test('salesman checks for valid coupon code having more or equal required cards count', function ($count) {
    actingAs($this->user);

    $couponable = CouponApplicable::first();

    $coupon = Coupon::factory()
        ->create(
            [
                'coupon_applicable_id' => $couponable->id,
                'coupon_status_id' => 2,
                'min_threshold_type' => CouponMinThresholdTypeEnum::CARD_COUNT,
                'min_threshold_value' => 10,
            ]
        );

    getJson(route('v2.salesman.coupon.verify', [
        $coupon->code,
        'couponables_type' => 'service_level',
        'couponables_id' => $couponable->id,
        'items_count' => $count,
    ]))
        ->assertSuccessful();
})->with([10, 15, 20, 100]);
