<?php

use App\Models\Order;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Database\Seeders\UsersSeeder;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        UsersSeeder::class,
    ]);

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->customer = User::factory()->withRole(config('permission.roles.customer'))->create();
    Order::factory()->for($this->customer)->count(10)->create();

});

it('filters customers by submissions', function () {
    actingAs($this->user);
    getJson(route('customers.index'), [
        'filter[submissions]' => $this->customer->orders->count()
    ])
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'email' => $this->customer->email,
        ]);
});

it('filters customers by full name', function () {
    actingAs($this->user);
    getJson(route('customers.index'), [
        'filter[search]' => $this->customer->fullName
    ])
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'email' => $this->customer->email,
        ]);
});

it('filters customers by email', function () {
    actingAs($this->user);
    getJson(route('customers.index'), [
        'filter[search]' => $this->customer->email
    ])
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'email' => $this->customer->email,
        ]);
});

it('filters customers by customer number', function () {
    actingAs($this->user);
    getJson(route('customers.index'), [
        'filter[search]' => $this->customer->customer_number
    ])
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'customer_number' => $this->customer->customer_number,
        ]);
});

it('returns orders order by asc grand_total', function () {
    $response = $this->getJson('/api/admin/orders?sort=grand_total')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc grand_total', function () {
    $response = $this->getJson('/api/admin/orders?sort=-grand_total')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});
