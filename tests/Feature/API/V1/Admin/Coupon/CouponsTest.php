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
use function Pest\Laravel\seed;
use Symfony\Component\HttpFoundation\Response;

uses(WithFaker::class);

beforeEach(function () {
    seed(RolesSeeder::class);
    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->coupons = Coupon::factory(10)->create();
});

test('admin can get a list of coupons', function () {
    actingAs($this->user);
    getJson(route('v1.coupons.index'))
        ->assertOk();
});

test('admin can create a coupon with unlimited usage limit', function () {
    actingAs($this->user);
    postJson(route('v1.coupons.store'), [
        'code' => $this->faker->word(),
        'description' => $this->faker->sentence(),
        'type' => 'fixed',
        'discount_value' => random_int(10, 50),
        'coupon_applicable_id' => CouponApplicable::factory()->create()->id,
        'available_from' => now()->addDays(2)->toDateString(),
        'is_permanent' => true,
        'usage_allowed_per_user' => null,
    ])
        ->assertCreated();
});

test('admin can create a coupon that can be used just once by a user', function () {
    actingAs($this->user);
    postJson(route('v1.coupons.store'), [
        'code' => $this->faker->word(),
        'description' => $this->faker->sentence(),
        'type' => 'fixed',
        'discount_value' => random_int(10, 50),
        'coupon_applicable_id' => CouponApplicable::factory()->create()->id,
        'available_from' => now()->addDays(2)->toDateString(),
        'is_permanent' => true,
        'usage_allowed_per_user' => 1,
    ])
        ->assertCreated();
});

test('admin can get a single coupon', function () {
    $coupon = Coupon::factory()->create();
    actingAs($this->user);
    getJson(route('v1.coupons.show', ['coupon' => $coupon->id]))
        ->assertOk();
});

test('admin can create coupon for specific users', function () {
    actingAs($this->user);
    $users = User::factory(5)->create()->pluck('id');
    postJson(route('v1.coupons.store'), [
        'code' => $this->faker->word(),
        'description' => $this->faker->sentence(),
        'type' => 'fixed',
        'discount_value' => random_int(10, 50),
        'coupon_applicable_id' => CouponApplicable::FOR_USERS,
        'available_from' => now()->addDays(2)->toDateString(),
        'is_permanent' => true,
        'usage_allowed_per_user' => null,
        'couponables' => $users,
    ])
        ->assertCreated();

    expect(Couponable::count())->toBe(5);
});

test('admin can create coupon for specific payment plan', function () {
    actingAs($this->user);

    $paymentPlans = PaymentPlan::factory(5)->create()->pluck('id');
    
    postJson(route('v1.coupons.store'), [
        'code' => $this->faker->word(),
        'description' => $this->faker->sentence(),
        'type' => 'fixed',
        'discount_value' => random_int(10, 50),
        'coupon_applicable_id' => CouponApplicable::FOR_PAYMENT_PLANS,
        'available_from' => now()->addDays(2)->toDateString(),
        'usage_allowed_per_user' => null,
        'is_permanent' => true,
        'couponables' => $paymentPlans,
    ])
        ->assertCreated();

    expect(Couponable::count())->toBe(5);
});

test('admin can request related models for coupon list', function (string $relationShip) {
    actingAs($this->user);

    getJson(route('v1.coupons.index', ['include[]' => $relationShip]))
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
    actingAs($this->user);

    getJson(route('v1.coupons.index', ['filters[search]' => $data['code']]))
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
    actingAs($this->user);

    getJson(route('v1.coupons.index', ['filters[search]' => $data['status']]))
        ->assertOk()
        ->assertJsonFragment(['id' => $data['id']]);
})->with([
    fn () => ['id' => $this->coupons[0]->id, 'status' => $this->coupons[0]->couponStatus->code],
    fn () => ['id' => $this->coupons[1]->id, 'status' => $this->coupons[1]->couponStatus->code],
    fn () => ['id' => $this->coupons[2]->id, 'status' => $this->coupons[2]->couponStatus->code],
    fn () => ['id' => $this->coupons[3]->id, 'status' => $this->coupons[3]->couponStatus->code],
    fn () => ['id' => $this->coupons[4]->id, 'status' => $this->coupons[4]->couponStatus->code],
]);

test('admin can not create coupon with more than 100% discount', function () {
    actingAs($this->user);
    postJson(route('v1.coupons.store'), [
        'code' => $this->faker->word(),
        'description' => $this->faker->sentence(),
        'type' => 'percentage',
        'discount_value' => 101,
        'coupon_applicable_id' => CouponApplicable::factory()->create()->id,
        'available_from' => now()->addDays(2)->toDateString(),
        'is_permanent' => true,
    ])
        ->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
});

test('admin can create coupon 100% discount', function () {
    actingAs($this->user);
    postJson(route('v1.coupons.store'), [
        'code' => $this->faker->word(),
        'description' => $this->faker->sentence(),
        'type' => 'percentage',
        'discount_value' => 100,
        'coupon_applicable_id' => CouponApplicable::factory()->create()->id,
        'usage_allowed_per_user' => null,
        'is_permanent' => true,

    ])
        ->assertCreated();
});

test('admin can not create coupon with fixed value more than service level', function () {
    actingAs($this->user);
    postJson(route('v1.coupons.store'), [
        'code' => $this->faker->word(),
        'description' => $this->faker->sentence(),
        'type' => 'percentage',
        'discount_value' => 1000000000000000,
        'coupon_applicable_id' => CouponApplicable::FOR_PAYMENT_PLANS,
        'available_from' => now()->addDays(2)->toDateString(),
        'is_permanent' => true,
        'couponables' => [1,2,3],
    ])
        ->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
});

test('admin can not create coupon with end date less than the start date of coupon availability', function () {
    actingAs($this->user);
    postJson(route('v1.coupons.store'), [
        'code' => $this->faker->word(),
        'description' => $this->faker->sentence(),
        'type' => 'percentage',
        'discount_value' => 10,
        'coupon_applicable_id' => CouponApplicable::FOR_PAYMENT_PLANS,
        'available_from' => now()->addDays(2)->toDateString(),
        'is_permanent' => false,
        'available_till' => now()->toDateString(),
        'couponables' => [1,2,3],
    ])
        ->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
});

test('admin can create coupon with same start and end date date of coupon availability', function () {
    actingAs($this->user);
    postJson(route('v1.coupons.store'), [
        'code' => $this->faker->word(),
        'description' => $this->faker->sentence(),
        'type' => 'percentage',
        'discount_value' => 10,
        'coupon_applicable_id' => CouponApplicable::FOR_PAYMENT_PLANS,
        'available_from' => now()->addDays(2)->toDateString(),
        'is_permanent' => false,
        'usage_allowed_per_user' => null,
        'available_till' => now()->addDays(2)->toDateString(),
        'couponables' => [1,2,3],
    ])
        ->assertCreated();
});

test('admin can create coupon with today start date', function () {
    actingAs($this->user);
    postJson(route('v1.coupons.store'), [
        'code' => $this->faker->word(),
        'description' => $this->faker->sentence(),
        'type' => 'percentage',
        'discount_value' => 10,
        'coupon_applicable_id' => CouponApplicable::FOR_PAYMENT_PLANS,
        'available_from' => now()->toDateString(),
        'is_permanent' => false,
        'usage_allowed_per_user' => null,
        'available_till' => now()->addDays(2)->toDateString(),
        'couponables' => [1,2,3],
    ])
        ->assertCreated();
});

test('admin can not create coupon with past start date', function () {
    actingAs($this->user);
    postJson(route('v1.coupons.store'), [
        'code' => $this->faker->word(),
        'description' => $this->faker->sentence(),
        'type' => 'percentage',
        'discount_value' => 10,
        'coupon_applicable_id' => CouponApplicable::FOR_PAYMENT_PLANS,
        'available_from' => now()->subDays(2)->toDateString(),
        'is_permanent' => false,
        'available_till' => now()->addDays(2)->toDateString(),
        'couponables' => [1,2,3],
    ])
        ->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
});

test('admin can create coupon with flat discount', function () {
    actingAs($this->user);
    postJson(route('v1.coupons.store'), [
        'code' => $this->faker->word(),
        'description' => $this->faker->sentence(),
        'type' => 'flat',
        'discount_value' => 200,
        'coupon_applicable_id' => CouponApplicable::factory()->create()->id,
        'is_permanent' => true,
        'usage_allowed_per_user' => null,
    ])
        ->assertCreated();
});
