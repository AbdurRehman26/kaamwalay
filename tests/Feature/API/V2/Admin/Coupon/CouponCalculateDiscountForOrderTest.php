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
use Database\Seeders\RolesSeeder;

use function Pest\Laravel\postJson;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->paymentPlan = PaymentPlan::factory()->withPaymentPlanRanges()->create(['max_protection_amount' => 300]);
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

    $this->order = Order::factory()->create([
        'payment_plan_id' => $this->paymentPlan->id,
    ]);

    OrderItem::factory()->for($this->order)->create();

    $this->user = User::factory()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->actingAs($this->user);
});

it('calculates coupon discount for order', function () {
    postJson(
        '/api/v2/admin/orders/'.$this->order->id.'/coupons/calculate-discount',
        [
            'coupon' => [
                'id' => $this->coupon->id,
                'code' => $this->coupon->code,
            ],
        ]
    )->assertOk()
        ->assertJsonStructure([
            'data' => [
                'coupon',
                'discounted_amount',
            ],
        ]);
});
