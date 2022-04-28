<?php

use App\Exceptions\API\Customer\Coupon\CouponFlatValueDiscountGreaterThanOrder;
use App\Models\CardProduct;
use App\Models\Coupon;
use App\Models\Couponable;
use App\Models\CouponApplicable;
use App\Models\CouponStat;
use App\Models\CouponStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderPaymentPlan;
use App\Models\PaymentPlan;
use App\Models\User;
use App\Services\Coupon\CouponService;
use App\Services\Order\Shipping\ShippingFeeService;

beforeEach(function () {
    $this->couponService = resolve(CouponService::class);

    $this->paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => 300]);
    $this->orderPaymentPlan = OrderPaymentPlan::factory()->create([
        'id' => $this->paymentPlan->id,
        'price' => $this->paymentPlan->price,
        'max_protection_amount' => $this->paymentPlan->max_protection_amount,
        'turnaround' => $this->paymentPlan->turnaround,
    ]);

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
        ->for($this->user)
        ->create([
            'payment_plan_id' => $this->paymentPlan->id,
        ]);

    OrderItem::factory()->for($this->order)->count(2)->create();


    $this->actingAs($this->user);
});

it('calculates discount for service level order', function () {
    $discount = $this->couponService->calculateDiscount($this->order->coupon, $this->order);

    if ($this->coupon->type === 'fixed') {
        $couponDiscount = (float) ($this->coupon->discount_value) * array_sum(array_column($this->order->orderItems->toArray(), 'quantity'));
    } elseif ($this->coupon->type === 'flat') {
        $serviceFee = $this->paymentPlan->price * array_sum(array_column($this->order->orderItems->toArray(), 'quantity'));
        $insuredShipping = ShippingFeeService::calculate(
            array_sum(array_column($this->order->orderItems->toArray(), 'declared_value_per_unit')),
            array_sum(array_column($this->order->orderItems->toArray(), 'quantity'))
        );

        $couponDiscount = $serviceFee + $insuredShipping - $this->order->coupon->discount_value;
    } else {
        $serviceFee = $this->paymentPlan->price * array_sum(array_column($this->order->orderItems->toArray(), 'quantity'));
        $couponDiscount = (float) (($this->coupon->discount_value * $serviceFee) / 100);
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
        $couponDiscount = (float) $this->coupon->discount_value;
    } elseif ($this->coupon->type === 'flat') {
        $serviceFee = $this->paymentPlan->price * array_sum(array_column($this->order->orderItems->toArray(), 'quantity'));
        $insuredShipping = ShippingFeeService::calculate(
            array_sum(array_column($this->order->orderItems->toArray(), 'declared_value_per_unit')),
            array_sum(array_column($this->order->orderItems->toArray(), 'quantity'))
        );

        $couponDiscount = $serviceFee + $insuredShipping - $this->order->coupon->discount_value;
    } else {
        $serviceFee = $this->paymentPlan->price * array_sum(array_column($this->order->orderItems->toArray(), 'quantity'));
        $couponDiscount = (float) (($this->coupon->discount_value * $serviceFee) / 100);
    }

    expect($discount)->toBe($couponDiscount);
});

it('calculates flat discount for order', function () {
    $this->coupon->update(
        ['type' => 'flat']
    );

    $flatDiscount = $this->couponService->calculateDiscount($this->order->coupon, $this->order);

    $serviceFee = $this->paymentPlan->price * array_sum(array_column($this->order->orderItems->toArray(), 'quantity'));
    $insuredShipping = ShippingFeeService::calculate(
        array_sum(array_column($this->order->orderItems->toArray(), 'declared_value_per_unit')),
        array_sum(array_column($this->order->orderItems->toArray(), 'quantity'))
    );

    $flatCouponDiscount = $serviceFee + $insuredShipping - $this->order->coupon->discount_value;

    expect($flatDiscount)->toBe($flatCouponDiscount);
});

it('gives exception when flat coupon value is greater than order', function () {
    $discountValue = $this->order->coupon->discount_value * 100000;
    $this->order->coupon->update(
        [
            'discount_value' => $discountValue,
            'type' => 'flat',
        ]
    );
    
    $this->couponService->calculateDiscount($this->order->coupon, $this->order);
})->throws(CouponFlatValueDiscountGreaterThanOrder::class, 'Coupon applied value is greater than your order. Please choose another coupon.');

it('calculates stats for coupon', function () {
    $this->order->coupon()->update(['type' => Coupon::TYPE_FIXED]);
    $this->coupon->couponApplicable()->update(['code' => 'service_fee']);

    $this->order->discounted_amount = (float) $this->couponService->calculateDiscount($this->order->coupon, $this->order);
    $this->order->grand_total = $this->order->grand_total - $this->order->discounted_amount;
    $this->order->save();

    $this->couponService->updateCouponLogs($this->order);
    $this->couponService->updateCouponStats($this->order->coupon);
    $couponStat = CouponStat::whereCouponId($this->order->coupon->id)->first();

    expect((int)$couponStat->times_used)->toBe(1);
    expect($this->order->discounted_amount)->toBe((float)$couponStat->total_discount);
});
