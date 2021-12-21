<?php

use App\Models\Coupon;
use App\Models\CouponApplicable;
use App\Models\PaymentPlan;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed(RolesSeeder::class);
    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();
});

test('admin can get a list of coupons', function () {
    $this->actingAs($this->user);
    $this->getJson(route('coupons.index'))
        ->assertOk();
});

test('admin can create coupon', function () {
    $this->actingAs($this->user);
    $this->postJson(route('coupons.store'), [
        'code' => $this->faker->word,
        'type' => 'fixed',
        'discount_value' => random_int(10, 50),
        'coupon_applicable_id' => CouponApplicable::factory()->create()->id,
        'available_from' => now()->addDays(2)->toDateTimeString(),
        'is_permanent' => false,
    ])
        ->dump()
        ->assertCreated();
});

test('admin can get a single coupon', function () {
    $coupon = Coupon::factory()->create();
    $this->actingAs($this->user);
    $this->getJson(route('coupons.show', ['coupon' => $coupon->id]))
        ->assertOk();
});

test('admin can create coupon for specific users', function () {
    $this->actingAs($this->user);
    $users = User::factory(5)->create()->pluck('id');
    $this->postJson(route('coupons.store'), [
        'code' => $this->faker->word,
        'type' => 'fixed',
        'discount_value' => random_int(10, 50),
        'coupon_applicable_id' => CouponApplicable::FOR_USERS,
        'available_from' => now()->addDays(2)->toDateTimeString(),
        'is_permanent' => false,
        'couponables' => $users,
    ])
        ->dump()
        ->assertCreated();

    expect(\App\Models\Couponable::count())->toBe(5);
});

test('admin can create coupon for specific payment plan', function () {
    $this->actingAs($this->user);
    $paymentPlans = PaymentPlan::factory(5)->create()->pluck('id');
    $this->postJson(route('coupons.store'), [
        'code' => $this->faker->word,
        'type' => 'fixed',
        'discount_value' => random_int(10, 50),
        'coupon_applicable_id' => CouponApplicable::FOR_PAYMENT_PLANS,
        'available_from' => now()->addDays(2)->toDateTimeString(),
        'is_permanent' => false,
        'couponables' => $paymentPlans,
    ])
        ->dump()
        ->assertCreated();

    expect(\App\Models\Couponable::count())->toBe(5);
});
