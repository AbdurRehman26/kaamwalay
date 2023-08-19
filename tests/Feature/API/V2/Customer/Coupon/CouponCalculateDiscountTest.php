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

    $couponApplicableUser = CouponApplicable::factory()
        ->create(
            [
                'code' => 'user',
                'label' => 'User',
                'is_active' => 1,
            ]
        );

    $this->referralCoupon = Coupon::factory()
        ->create(
            [
                'coupon_status_id' => CouponStatus::STATUS_ACTIVE,
                'type' => 'percentage',
                'code' => 'REFERRAL_COUPON',
                'discount_value' => 35,
                'coupon_applicable_id' => $couponApplicableUser->id,
                'max_discount_applicable_items' => 20,
            ]
        );

    $this->coupon = Coupon::factory()
        ->create(
            [
                'coupon_applicable_id' => $couponApplicable->id,
                'coupon_status_id' => CouponStatus::STATUS_ACTIVE,
            ]
        );

    $this->freeCardCoupon = Coupon::factory()
        ->create(
            [
                'coupon_applicable_id' => $couponApplicable->id,
                'coupon_status_id' => CouponStatus::STATUS_ACTIVE,
                'type' => 'free_cards',
                'code' => 'FREE_CARDS',
                'discount_value' => 2,
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

    $this->referee = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create();

    $this->referralCouponable = Couponable::factory()
        ->create(
            [
                'coupon_id' => $this->referralCoupon->id,
                'couponables_type' => Couponable::COUPONABLE_TYPES['user'],
                'couponables_id' => $this->referee->id,
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
        route('v2.coupon.discount'),
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
        route('v2.coupon.discount'),
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
        route('v2.coupon.discount'),
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

it('calculates coupon discount for free cards', function () {
    actingAs($this->user);
    $paymentPlan = PaymentPlan::factory()->withPaymentPlanRanges(20)->create([
        'price' => 20,
        'max_protection_amount' => 300,
    ]);

    postJson(
        route('v2.coupon.discount'),
        [
            'coupon' => [
                'id' => $this->freeCardCoupon->id,
                'code' => $this->freeCardCoupon->code,
            ],
            'couponables_type' => $this->couponable->code,

            'payment_plan' => [
                'id' => $paymentPlan->id,
            ],
            'items' => [
                [
                    'card_product' => [
                        'id' => $this->cardProduct->id,
                    ],
                    'quantity' => 5,
                    'declared_value_per_unit' => 20,
                ],
                [
                    'card_product' => [
                        'id' => $this->cardProduct->id,
                    ],
                    'quantity' => 5,
                    'declared_value_per_unit' => 20,
                ],
            ],
        ]
    )
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'coupon',
                'discounted_amount',
            ],
        ])->assertJsonFragment([
            'discounted_amount' => 40,
        ]);
});

it('calculates discount for user referral coupon for different card quantities', function (mixed $paymentPlanRange) {

    actingAs($this->referee);

    $serviceFee = min($paymentPlanRange->min_cards, 20) * $paymentPlanRange->price;
    $discountedAmount = ($this->referralCoupon->discount_value * $serviceFee) / 100;

    postJson(
        route('v2.coupon.discount'),
        [
            'coupon' => [
                'id' => $this->referralCoupon->id,
                'code' => $this->referralCoupon->code,
            ],
            'couponables_type' => $this->referralCouponable->code,

            'payment_plan' => [
                'id' => $paymentPlanRange->paymentPlan->id,
            ],
            'items' => [
                [
                    'card_product' => [
                        'id' => $this->cardProduct->id,
                    ],
                    'quantity' => $paymentPlanRange->min_cards,
                    'declared_value_per_unit' => 20,
                ],
            ],
        ]
    )
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'coupon',
                'discounted_amount',
            ],
        ])->assertJsonFragment([
            'discounted_amount' => $discountedAmount,
        ]);
})->with([
    fn () => $this->paymentPlan->paymentPlanRanges[0],
    fn () => $this->paymentPlan->paymentPlanRanges[1],
    fn () => $this->paymentPlan->paymentPlanRanges[2],
    fn () => $this->paymentPlan->paymentPlanRanges[3],
]);
