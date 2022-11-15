<?php

use App\Models\Order;
use App\Models\SalesmanCommissionPayment;
use App\Models\User;
use Database\Seeders\RolesSeeder;

use Illuminate\Foundation\Testing\WithFaker;

use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);
    Bus::fake();

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->salesman = User::factory()->withSalesmanRole()->create();

    Order::factory()->count(10)->create([
        'salesman_id' => $this->salesman->id,
        'salesman_commission' => 10,
    ]);

    SalesmanCommissionPayment::factory()->count(5)->create([
        'salesman_id' => $this->salesman->id,
        'amount' => 10,
    ]);

    $this->actingAs($this->user);
});

it('returns paid commission list for specific salesman', function () {
    getJson(route('v2.salesmen.commission-payments.index', ['salesman' => $this->salesman]))
        ->assertOk()
        ->assertJsonCount(5, 'data');
});

it('admin can create a commission payment', function () {
    postJson(route('v2.salesmen.commission-payments.store', ['salesman' => $this->salesman]), [
        'file_url' => $this->faker->imageUrl(),
        'notes' => $this->faker->sentence(),
        'amount' => 30,
    ])
        ->assertCreated();
});

it('admin can not create a commission payment more than the unpaid amount', function () {
    postJson(route('v2.salesmen.commission-payments.store', ['salesman' => $this->salesman]), [
        'file_url' => $this->faker->imageUrl(),
        'notes' => $this->faker->sentence(),
        'amount' => 60,
    ])
        ->assertUnprocessable();
});

it('admin can not create a commission payment for user that does not have the salesman role', function (string $role) {
    $user = User::factory()->withRole($role)->create();
    postJson(route('v2.salesmen.commission-payments.store', ['salesman' => $this->user]), [
        'file_url' => $this->faker->imageUrl(),
        'notes' => $this->faker->sentence(),
        'amount' => 60,
    ])
        ->assertUnprocessable();
})->with([
    fn () => config('permission.roles.customer'),
    fn () => config('permission.roles.admin'),
]);

it('users without admin role can not create a commission payment', function (string $role) {
    $user = User::factory()->withRole($role)->create();
    $this->actingAs($user);
    postJson(route('v2.salesmen.commission-payments.store', ['salesman' => $this->salesman]), [
        'file_url' => $this->faker->imageUrl(),
        'notes' => $this->faker->sentence(),
        'amount' => 60,
    ])
        ->assertForbidden();
})->with([
    fn () => config('permission.roles.customer'),
    fn () => config('permission.roles.salesman'),
]);
