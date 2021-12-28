<?php

use App\Models\Order;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
const CUSTOMERS_COUNT = 1;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->customer = User::factory()->withRole(config('permission.roles.customer'))->create();
    Order::factory()->for($this->customer)->count(30)->create();

    actingAs($this->user);
});

it('filters customers by submissions', function () {
    getJson(route('customers.index', [
        'filter[submissions]' => $this->customer->orders->count()
    ]))
        ->assertOk()
        ->assertJsonCount(CUSTOMERS_COUNT, ['data'])
        ->assertJsonFragment([
            'email' => $this->customer->email,
        ]);
});

it('filters customers by full name', function () {
    getJson(route('customers.index', [
        'filter[search]' => $this->customer->fullName
    ]))
        ->assertOk()
        ->assertJsonCount(CUSTOMERS_COUNT, ['data'])
        ->assertJsonFragment([
            'email' => $this->customer->email,
        ]);
});

it('filters customers by email', function () {
    getJson(route('customers.index', [
        'filter[search]' => $this->customer->email
    ]))
        ->assertOk()
        ->assertJsonCount(CUSTOMERS_COUNT, ['data'])
        ->assertJsonFragment([
            'email' => $this->customer->email,
        ]);
});

it('filters customers by customer number', function () {
    getJson(route('customers.index', [
        'filter[search]' => $this->customer->customer_number
    ]))
        ->assertOk()
        ->assertJsonCount(CUSTOMERS_COUNT, ['data'])
        ->assertJsonFragment([
            'customer_number' => $this->customer->customer_number,
        ]);
});
