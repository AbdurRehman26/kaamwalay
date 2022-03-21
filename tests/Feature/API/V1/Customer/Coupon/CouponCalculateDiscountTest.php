<?php

use App\Models\CardProduct;
use App\Models\Coupon;
use App\Models\Couponable;
use App\Models\CouponApplicable;
use App\Models\CouponLog;
use App\Models\CouponStatus;
use App\Models\Order;
use App\Models\PaymentPlan;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;

beforeEach(function () {
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
        ->create(
            [
                'coupon_applicable_id' => $couponApplicable->id,
                'coupon_status_id' => 2,
            ]
        );

    $this->limitedUsageCoupon = Coupon::factory()
        ->create(
            [
                'coupon_applicable_id' => $couponApplicable->id,
                'coupon_status_id' => 2,
                'usage_allowed_per_user' => 1,
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
});


it('calculates coupon discount', function () {
    actingAs($this->user);

    postJson(
        route('v1.coupon.discount'),
        [
            'coupon' => [
                'id' => $this->coupon->id,
                'code' => $this->coupon->code,
            ],
            'couponables_type' => $this->couponable->code,
            'couponables_id' => $this->couponable->id,

            'payment_plan' => [
                'id' => $this->paymentPlan->id,
            ],
            'items' => [
                [
                    'card_product' => [
                        'id' => $this->cardProduct->id,
                    ],
                    'quantity' => 1,
                    'declared_value_per_unit' => 500,
                ],
                [
                    'card_product' => [
                        'id' => $this->cardProduct->id,
                    ],
                    'quantity' => 1,
                    'declared_value_per_unit' => 500,
                ],
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

it('calculates coupon discount of limited usage coupon', function () {
    actingAs($this->user);

    postJson(
        route('v1.coupon.discount'),
        [
            'coupon' => [
                'id' => $this->limitedUsageCoupon->id,
                'code' => $this->limitedUsageCoupon->code,
            ],
            'couponables_type' => $this->couponable->code,

            'payment_plan' => [
                'id' => $this->paymentPlan->id,
            ],
            'items' => [
                [
                    'card_product' => [
                        'id' => $this->cardProduct->id,
                    ],
                    'quantity' => 1,
                    'declared_value_per_unit' => 500,
                ],
                [
                    'card_product' => [
                        'id' => $this->cardProduct->id,
                    ],
                    'quantity' => 1,
                    'declared_value_per_unit' => 500,
                ],
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

it('can not calculate coupon discount if usage limit is reached', function () {
    $this->order = Order::factory()->for($this->user)->for($this->limitedUsageCoupon)->create();
    CouponLog::factory()->for($this->order)->for($this->user)->for($this->limitedUsageCoupon)->create();

    postJson(
        route('v1.coupon.discount'),
        [
            'coupon' => [
                'id' => $this->limitedUsageCoupon->id,
                'code' => $this->limitedUsageCoupon->code,
            ],
            'couponables_type' => $this->couponable->code,

            'payment_plan' => [
                'id' => $this->paymentPlan->id,
            ],
            'items' => [
                [
                    'card_product' => [
                        'id' => $this->cardProduct->id,
                    ],
                    'quantity' => 1,
                    'declared_value_per_unit' => 500,
                ],
                [
                    'card_product' => [
                        'id' => $this->cardProduct->id,
                    ],
                    'quantity' => 1,
                    'declared_value_per_unit' => 500,
                ],
            ],
        ]
    )->assertStatus(422);
});
