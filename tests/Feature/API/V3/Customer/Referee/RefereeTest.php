<?php

use App\Models\Coupon;
use App\Models\Couponable;
use App\Models\CouponApplicable;
use App\Models\CouponStatus;
use App\Models\Referrer;
use App\Models\User;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $user = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create(['referred_by' => Referrer::factory()->create()]);

    CouponStatus::factory()->count(2)->create();

    $couponApplicable = CouponApplicable::factory()
        ->create(
            [
                'code' => 'users',
                'label' => 'Users',
                'is_active' => 1,
            ]
        );

    $this->coupon = Coupon::factory()
        ->create(
            [
                'coupon_applicable_id' => $couponApplicable->id,
                'coupon_status_id' => 2,
                'is_referred' => 1.,
                'created_by' => $user->id,
                'available_from' => now()->subDay(),
                'available_till' => now()->addDays(5),
            ]
        );

    Couponable::factory()
        ->create(
            [
                'coupon_id' => $this->coupon->id,
                'couponables_type' => Couponable::COUPONABLE_TYPES['user'],
                'couponables_id' => $user->id,

            ]
        );

    actingAs($user);
});

test('a referee can view his coupon', function () {
    $this->getJson('/api/v3/customer/referee/coupon')
        ->assertSuccessful()
        ->assertJsonStructure(['data' => [
            'id',
            'code',
            'available_from',
        ]]);
});

test('a referee can not view a coupon if it has expired.', function () {

    $this->coupon->available_from = now()->subDays(2);
    $this->coupon->available_to = now()->subDay();
    $this->coupon->save();

    $this->getJson('/api/v3/customer/referee/coupon')
        ->assertUnprocessable();
});
