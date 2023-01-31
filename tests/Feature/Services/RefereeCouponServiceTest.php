<?php

use App\Models\Referrer;
use App\Models\User;
use App\Services\RefereeCouponService;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed(RolesSeeder::class);

    $this->refereeCouponService = resolve(RefereeCouponService::class);

});

test('a coupon is assigned to referee when they sign up with a referral code', function () {
    $user = User::factory()->create([
        'referred_by' => Referrer::factory()->create()
    ]);

    $response = $this->refereeCouponService->createRefereeCoupon($user);

    dd($response);
});
