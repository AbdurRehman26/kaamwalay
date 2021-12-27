<?php

use App\Models\Coupon;
use App\Models\CouponStatusHistory;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\putJson;
use function Pest\Laravel\seed;

uses(WithFaker::class);

beforeEach(function () {
    seed(RolesSeeder::class);
    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();
});

test('admin can change coupon status', function (string $status) {
    actingAs($this->user);

    $coupon = Coupon::factory()->create();

    putJson(route('coupons.change-status', ['coupon' => $coupon]), [
        'status' => $status,
    ])->assertOk();

    expect(CouponStatusHistory::count())->toBe(1);
})->with([
    fn () => 'active',
    fn () => 'inactive',
    fn () => 'expired',
]);
