<?php

use App\Models\CardProduct;
use App\Models\Coupon;
use App\Models\Couponable;
use App\Models\CouponApplicable;
use App\Models\CouponStatus;
use App\Models\OrderItem;
use App\Models\PaymentPlan;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;

beforeEach(function () {
    $this->paymentPlan = PaymentPlan::factory()
        ->withPaymentPlanRanges()
        ->create(['max_protection_amount' => 300]);
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
        ->create(
            [
                'coupon_applicable_id' => $couponApplicable->id,
                'coupon_status_id' => 2,
                'type' => 'fixed',
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

    $this->actingAs($this->user);

    $orderItem = OrderItem::factory()->create();
    $this->order = $orderItem->order;
});

it('a customer can remove coupon from order payment page', function () {
    actingAs($this->user);

    $this->order->coupon_id = $this->coupon->id;
    $this->order->discounted_amount = rand(0, 500);
    $this->order->grand_total = $this->order->grand_total_before_discount - $this->order->discounted_amount - $this->order->payment_method_discounted_amount;

    postJson(
        route('v2.orders.coupon.remove', [
            'order' => $this->order->id,
        ])
    )->assertOk();

    $this->order->refresh();

    expect($this->order->coupon_id)->toBeNull()
        ->and($this->order->discounted_amount)->toBe(0.0)
        ->and($this->order->grand_total)->toBe((float) $this->order->grand_total_before_discount);
});
