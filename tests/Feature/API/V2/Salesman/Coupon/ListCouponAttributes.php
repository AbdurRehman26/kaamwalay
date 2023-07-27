<?php

use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\seed;

uses(WithFaker::class);

beforeEach(function () {
    seed(RolesSeeder::class);
    $this->user = User::factory()
        ->withSalesmanRole()
        ->create();
});

test('salesman can get coupon applicables', function () {
    actingAs($this->user);

    getJson(route('v2.salesman.coupon.applicables'))
        ->assertOk();
});
