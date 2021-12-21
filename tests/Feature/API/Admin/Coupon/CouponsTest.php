<?php

use App\Models\Coupon;
use App\Models\Couponable;
use App\Models\CouponApplicable;
use App\Models\PaymentPlan;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed(RolesSeeder::class);
    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->coupons = Coupon::factory(10)->create();
});

test('admin can get a list of coupons', function () {
    actingAs($this->user);
    getJson(route('coupons.index'))
        ->assertOk();
});

test('admin can create coupon', function () {
    $this->actingAs($this->user);
    postJson(route('coupons.store'), [
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
    getJson(route('coupons.show', ['coupon' => $coupon->id]))
        ->assertOk();
});

test('admin can create coupon for specific users', function () {
    $this->actingAs($this->user);
    $users = User::factory(5)->create()->pluck('id');
    postJson(route('coupons.store'), [
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

    expect(Couponable::count())->toBe(5);
});

test('admin can create coupon for specific payment plan', function () {
    $this->actingAs($this->user);
    $paymentPlans = PaymentPlan::factory(5)->create()->pluck('id');
    postJson(route('coupons.store'), [
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

    expect(Couponable::count())->toBe(5);
});

test('admin can request related models for coupon list', function (string $relationShip) {
    $this->actingAs($this->user);

    getJson(route('coupons.index', ['include[]' => $relationShip]))
        ->dump()
        ->assertOk()
        ->assertJsonStructure(['data' => [[Str::snake($relationShip)]]]);
})->with([
    fn () => 'couponStatus',
    fn () => 'couponApplicable',
    fn () => 'couponStats',
    fn () => 'couponLogs',
    fn () => 'users',
    fn () => 'paymentPlans',
]);

test('admin can search for specific coupon with coupon code from the coupon list', function (array $data) {
    $this->actingAs($this->user);

    getJson(route('coupons.index', ['filters[search]' => $data['code']]))
        ->dump()
        ->assertOk()
        ->assertJsonFragment(['id' => $data['id']]);
})->with([
    fn () => ['id' => $this->coupons[0]->id, 'code' => $this->coupons[0]->code],
    fn () => ['id' => $this->coupons[1]->id, 'code' => $this->coupons[1]->code],
    fn () => ['id' => $this->coupons[2]->id, 'code' => $this->coupons[2]->code],
    fn () => ['id' => $this->coupons[3]->id, 'code' => $this->coupons[3]->code],
    fn () => ['id' => $this->coupons[4]->id, 'code' => $this->coupons[4]->code],
    fn () => ['id' => $this->coupons[5]->id, 'code' => $this->coupons[5]->code],
]);

test('admin can search for specific coupon with coupon status from the coupon list', function (array $data) {
    $this->actingAs($this->user);

    getJson(route('coupons.index', ['filters[search]' => $data['status']]))
        ->dump()
        ->assertOk()
        ->assertJsonFragment(['id' => $data['id']]);
})->with([
    fn () => ['id' => $this->coupons[0]->id, 'status' => $this->coupons[0]->couponStatus->code],
    fn () => ['id' => $this->coupons[1]->id, 'status' => $this->coupons[1]->couponStatus->code],
    fn () => ['id' => $this->coupons[2]->id, 'status' => $this->coupons[2]->couponStatus->code],
    fn () => ['id' => $this->coupons[3]->id, 'status' => $this->coupons[3]->couponStatus->code],
    fn () => ['id' => $this->coupons[4]->id, 'status' => $this->coupons[4]->couponStatus->code],
]);
