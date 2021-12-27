<?php

use App\Models\CouponApplicable;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;
use Symfony\Component\HttpFoundation\Response;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\seed;

uses(WithFaker::class);

beforeEach(function () {
    seed(RolesSeeder::class);
    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();
});

test('admin can get couponable entities', function (string $couponApplicableId) {
    actingAs($this->user);

    getJson(route('couponable.entities', ['coupon_applicable_id' => $couponApplicableId]))
        ->assertOk();
})->with([
    fn () => CouponApplicable::FOR_PAYMENT_PLANS,
    fn () => CouponApplicable::FOR_USERS,
]);

test('admin can get error with invalid coupon applicable', function (string $couponApplicableId) {
    actingAs($this->user);

    getJson(route('couponable.entities', ['coupon_applicable_id' => $couponApplicableId]))
        ->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
})->with([
    fn () => 1,
    fn () => 4,
]);
