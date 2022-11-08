<?php

use App\Models\Order;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function PHPUnit\Framework\assertEquals;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);
    Bus::fake();

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->salesman = User::factory()->withRole(config('permission.roles.salesman'))->create();

    Order::factory()->count(15)->create([
        'salesman_id' => $this->salesman->id,
        'salesman_commission' => rand(0, 1000),
        'created_at' => now()->subDays(10),
    ]);
});

it('returns salesmen sales for the given dates', function () {
    actingAs($this->salesman);
    $response = getJson(route('v2.salesman.dashboard.sales', [
            'filter[from_date]' => now()->subDays(15)->toDateString(),
            'filter[to_date]' => now()->subDays(5)->toDateString(),
        ]))
        ->assertOk();

    assertEquals($response['data'], Order::sum('grand_total'));
});

it('returns salesman`s commissions for the given dates', function () {
    actingAs($this->salesman);
    $response = getJson(route('v2.salesman.dashboard.commission-earned', [
        'filter[from_date]' => now()->subDays(15)->toDateString(),
        'filter[to_date]' => now()->subDays(5)->toDateString(),
    ]))->assertOk();

    assertEquals($response['data'], Order::sum('salesman_commission'));
});
