<?php

use App\Models\Coupon;
use App\Models\CouponStatusHistory;
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

test('admin can change coupon status', function () {
    $this->actingAs($this->user);

    $coupon = Coupon::factory()->create();

    $this->putJson(route('coupons.change-status', ['coupon' => $coupon]), [
        'status' => 'inactive',
    ])->assertOk();

    expect(CouponStatusHistory::count())->toBe(1);
});
