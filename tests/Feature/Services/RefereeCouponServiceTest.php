<?php

use App\Models\Coupon;
use App\Models\Referrer;
use App\Models\User;
use App\Services\ReferralProgram\RefereeCouponService;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed(RolesSeeder::class);

    $this->refereeCouponService = resolve(RefereeCouponService::class);
});

test('a coupon is assigned to referee when they sign up with a referral code', function () {
    $user = User::factory()->create([
        'referred_by' => Referrer::factory()->create(),
    ]);

    $response = $this->refereeCouponService->createRefereeCoupon($user);

    expect(Coupon::whereCode($response->code)->exists())->toBe(true);
    expect((bool) $response->is_system_generated)->toBe(true);
    expect($response->couponable->couponables_type)->toBe(\App\Models\User::class);
});
