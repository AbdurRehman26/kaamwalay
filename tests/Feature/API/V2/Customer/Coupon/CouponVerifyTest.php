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
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

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

    getJson(route('v2.coupon.verify', [
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

    getJson(route('v2.coupon.verify', $this->coupon->code . 'test'))
        ->assertStatus(422);
});

test('customer checks for valid coupon code on wrong service level', function () {
    actingAs($this->user);

    getJson(route('v2.coupon.verify', [
        $this->coupon->code,
        'couponables_type' => 'service_level',
        'couponables_id' => 100,
    ]))
        ->assertStatus(422);
});

test('customer checks for valid coupon code having items less than required', function ($count) {
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

    getJson(route('v2.coupon.verify', [
        $coupon->code,
        'couponables_type' => 'service_level',
        'couponables_id' => $couponable->id,
        'items_count' => 1,
    ]))
        ->assertStatus(422);
})->with([1, 3, 5, 9]);

test('customer checks for valid coupon code having more or equal required cards count', function ($count) {
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

    getJson(route('v2.coupon.verify', [
        $coupon->code,
        'couponables_type' => 'service_level',
        'couponables_id' => $couponable->id,
        'items_count' => $count,
    ]))
        ->assertSuccessful();
})->with([10, 15, 20, 100]);

test('customer checks for valid coupon code having more or equal required cards count with already created order', function () {
    actingAs($this->user);

    $couponable = CouponApplicable::first();

    $coupon = Coupon::factory()
        ->create(
            [
                'coupon_applicable_id' => $couponable->id,
                'coupon_status_id' => 2,
                'min_threshold_type' => CouponMinThresholdTypeEnum::CARD_COUNT,
                'min_threshold_value' => 25,
            ]
        );

    $order = Order::factory()->create();

    OrderItem::factory()->count(30)->create([
        'order_id' => $order->id,
    ]);


    postJson(route('v2.orders.coupon.discount', [
        'order' => $order,
        'coupon' => ['code' => $coupon->code],
    ]))
        ->assertSuccessful();
});

test('customer checks for valid coupon code having less than the required cards count with already created order', function () {
    actingAs($this->user);

    $couponable = CouponApplicable::first();

    $coupon = Coupon::factory()
        ->create(
            [
                'coupon_applicable_id' => $couponable->id,
                'coupon_status_id' => 2,
                'min_threshold_type' => CouponMinThresholdTypeEnum::CARD_COUNT,
                'min_threshold_value' => 25,
            ]
        );

    $order = Order::factory()->create();

    OrderItem::factory()->count(5)->create([
        'order_id' => $order->id,
        'quantity' => 2,
    ]);


    postJson(route('v2.orders.coupon.discount', [
        'order' => $order,
        'coupon' => ['code' => $coupon->code],
    ]))
        ->assertUnprocessable();
});
