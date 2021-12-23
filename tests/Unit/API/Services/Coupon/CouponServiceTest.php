<?php

use App\Models\CardProduct;
use App\Models\Coupon;
use App\Models\Couponable;
use App\Models\CouponApplicable;
use App\Models\CouponStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentPlan;
use App\Models\User;
use App\Services\Coupon\CouponService;

beforeEach(function () {
    $this->couponService = resolve(CouponService::class);

    $this->paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => 300]);
    $this->cardProduct = CardProduct::factory()->create();

    CouponStatus::factory()->count(2)->create();

    $couponApplicable = CouponApplicable::factory()
        ->create(
            [
                'code' => 'service_level',
                'label' => 'Payments',
                'is_active' => 1,
            ]
        );

    $this->coupon = Coupon::factory()
        ->for($couponApplicable)
        ->create();

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

    $this->order = Order::factory()
        ->for($this->paymentPlan)
        ->for($this->coupon)
        ->for($this->user)->create();

    OrderItem::factory()->for($this->order)->count(2)->create();


    $this->actingAs($this->user);
});

it('calculates discount for service level order', function () {

    $discount = $this->couponService->calculateDiscount($this->order->coupon, $this->order);

    if ($this->coupon->type === 'fixed') {
        $couponDiscount = ($this->paymentPlan->price - $this->coupon->discount_value) * array_sum(array_column($this->order->orderItems->toArray(), 'quantity'));
    } else {
        $serviceFee = $this->paymentPlan->price * array_sum(array_column($this->order->orderItems->toArray(), 'quantity'));
        $couponDiscount = (($this->coupon->discount_value * $serviceFee) / 100);
    }

    expect($discount)->toBe($couponDiscount);
});

it('calculates discount for service fee order', function () {

    $this->coupon->couponable()->delete();
    $this->coupon->couponApplicable()->update(
        ['code' => 'service_fee', 'label' => 'Service Fee']
    );

    $discount = $this->couponService->calculateDiscount($this->order->coupon, $this->order);

    if ($this->coupon->type === 'fixed') {

        $serviceFee = $this->paymentPlan->price * array_sum(array_column($this->order->orderItems->toArray(), 'quantity'));
        $couponDiscount = min(($serviceFee - $this->coupon->discount_value), $serviceFee);

    } else {
        $serviceFee = $this->paymentPlan->price * array_sum(array_column($this->order->orderItems->toArray(), 'quantity'));
        $couponDiscount = (($this->coupon->discount_value * $serviceFee) / 100);
    }

    expect($discount)->toBe($couponDiscount);
});
