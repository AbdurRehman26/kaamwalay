<?php

use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()->withSalesmanRole()->create();

    $this->customer = User::factory()->withRole(config('permission.roles.customer'))
        ->create([
            'first_name' => 'test_first_name',
            'created_at' => now()->subDays(10)->toDateString(),
            'salesman_id' => $this->user->id,
        ]);

    $this->orders = Order::factory()->for($this->customer)->count(10)->create([
        'order_status_id' => 5,
        'salesman_id' => $this->user->id,
    ]);

    OrderStatusHistory::factory()->count(5)->sequence(
        ['order_status_id' => OrderStatus::PLACED, 'order_id' => $this->orders[0]->id, 'user_id' => $this->customer->id],
        ['order_status_id' => OrderStatus::PLACED, 'order_id' => $this->orders[1]->id, 'user_id' => $this->customer->id],
        ['order_status_id' => OrderStatus::PLACED, 'order_id' => $this->orders[2]->id, 'user_id' => $this->customer->id],
        ['order_status_id' => OrderStatus::PLACED, 'order_id' => $this->orders[3]->id, 'user_id' => $this->customer->id],
        ['order_status_id' => OrderStatus::PLACED, 'order_id' => $this->orders[4]->id, 'user_id' => $this->customer->id]
    )->create();

    Order::factory()->count(10)->create([
        'order_status_id' => 1,
        'salesman_id' => $this->user->id,
    ]);

    User::factory()->withRole(config('permission.roles.customer'))
        ->count(10)
        ->create([
            'first_name' => $this->faker()->firstName,
            'created_at' => now()->addDays(4)->toDateString(),
            'salesman_id' => $this->user->id,
        ]);

    actingAs($this->user);
});

it('filters customers by submissions', function () {
    $count = $this->customer->orders()->placed()->count();
    getJson(route('v2.salesman.customers.index', [
        'filter[submissions]' => "1, $count",
    ]))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'email' => $this->customer->email,
        ]);
});

it('returns customers that do not have submissions', function () {
    getJson(route('v2.salesman.customers.index', [
        'filter[submissions]' => '0, 0',
    ]))
        ->assertOk()
        ->assertJsonCount(10, ['data'])
        ->assertJsonStructure([
            'data' => [
                [
                    'profile_image',
                    'full_name',
                    'customer_number',
                    'email',
                    'phone',
                    'created_at',
                    'submissions',
                    'cards_count',
                ],
            ],
        ]);
});

it('filters customers by signup date', function () {
    getJson(route('v2.salesman.customers.index', [
        'filter[signed_up_between]' => now()->subDays(15)->toDateString() . ', ' . now()->subDays(5)->toDateString(),
    ]))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'email' => $this->customer->email,
        ]);
});

it('returns customers that do not lie between signed up date', function () {
    getJson(route('v2.salesman.customers.index', [
        'filter[signed_up_between]' => now()->subDays(1)->toDateString() . ', ' . now()->addDays(5)->toDateString(),
    ]))
        ->assertOk()
        ->assertJsonCount(10, ['data'])
        ->assertJsonStructure([
            'data' => [
                [
                    'profile_image',
                    'full_name',
                    'customer_number',
                    'email',
                    'phone',
                    'created_at',
                    'submissions',
                    'cards_count',
                ],
            ],
        ]);
});

it('filters customers by name', function () {
    getJson(route('v2.salesman.customers.index', [
        'filter[search]' => $this->customer->first_name,
    ]))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'email' => $this->customer->email,
        ]);
});

it('does not filter customers by incorrect name', function () {
    getJson(route('v2.salesman.customers.index', [
        'filter[search]' => $this->customer->first_name . 'Testing',
    ]))
        ->assertOk()
        ->assertJsonCount(0, ['data']);
});

it('filters customers by email', function () {
    getJson(route('v2.salesman.customers.index', [
        'filter[search]' => $this->customer->email,
    ]))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'email' => $this->customer->email,
        ]);
});

it('does not filter customers by incorrect email', function () {
    getJson(route('v2.salesman.customers.index', [
        'filter[search]' => $this->customer->email . 'Testing',
    ]))
        ->assertOk()
        ->assertJsonCount(0, ['data']);
});

it('filters customers by customer number', function () {
    getJson(route('v2.salesman.customers.index', [
        'filter[search]' => $this->customer->customer_number,
    ]))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'customer_number' => $this->customer->customer_number,
        ]);
});

it('does not filter customers by incorrect customer number', function () {
    getJson(route('v2.salesman.customers.index', [
        'filter[search]' => $this->customer->customer_number . 'Testing',
    ]))
        ->assertOk()
        ->assertJsonCount(0, ['data']);
});
