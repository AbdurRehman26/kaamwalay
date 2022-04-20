<?php

use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();

    $this->customer = User::factory()->withRole(config('permission.roles.customer'))
        ->create([
            'first_name' => 'test_first_name',
            'created_at' => now()->subDays(10)->toDateString(),
        ]);

    $this->orders = Order::factory()->for($this->customer)->state(new Sequence(
        [
            'order_status_id' => 5,
        ]
    ))->count(10)->create();

    OrderStatusHistory::factory()->count(5)->sequence(
        ['order_status_id' => OrderStatus::PLACED, 'order_id' => $this->orders[0]->id, 'user_id' => $this->customer->id],
        ['order_status_id' => OrderStatus::PLACED, 'order_id' => $this->orders[1]->id, 'user_id' => $this->customer->id],
        ['order_status_id' => OrderStatus::PLACED, 'order_id' => $this->orders[2]->id, 'user_id' => $this->customer->id],
        ['order_status_id' => OrderStatus::PLACED, 'order_id' => $this->orders[3]->id, 'user_id' => $this->customer->id],
        ['order_status_id' => OrderStatus::PLACED, 'order_id' => $this->orders[4]->id, 'user_id' => $this->customer->id]
    )->create();

    Order::factory()->state(new Sequence(
        [
            'order_status_id' => 1,
        ]
    ))->count(10)->create();

    actingAs($this->user);
});

it('filters customers by submissions', function () {
    $count = $this->customer->orders()->placed()->count();
    getJson(route('v2.customers.index', [
        'filter[submissions]' => "1, $count",
    ]))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'email' => $this->customer->email,
        ]);
});

it('returns customers that do not have submissions', function () {
    getJson(route('v2.customers.index', [
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
                ],
            ],
        ]);
});

it('filters customers by signup date', function () {
    getJson(route('v2.customers.index', [
        'filter[signed_up_between]' => now()->subDays(15)->toDateString() . ', ' . now()->subDays(5)->toDateString(),
    ]))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'email' => $this->customer->email,
        ]);
});

it('returns customers that do not lie between signed up date', function () {
    getJson(route('v2.customers.index', [
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
                ],
            ],
        ]);
});

it('filters customers by name', function () {
    getJson(route('v2.customers.index', [
        'filter[search]' => $this->customer->first_name,
    ]))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'email' => $this->customer->email,
        ]);
});

it('does not filter customers by incorrect name', function () {
    getJson(route('v2.customers.index', [
        'filter[search]' => $this->customer->first_name . 'Testing',
    ]))
        ->assertOk()
        ->assertJsonCount(0, ['data']);
});

it('filters customers by email', function () {
    getJson(route('v2.customers.index', [
        'filter[search]' => $this->customer->email,
    ]))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'email' => $this->customer->email,
        ]);
});

it('does not filter customers by incorrect email', function () {
    getJson(route('v2.customers.index', [
        'filter[search]' => $this->customer->email . 'Testing',
    ]))
        ->assertOk()
        ->assertJsonCount(0, ['data']);
});

it('filters customers by customer number', function () {
    getJson(route('v2.customers.index', [
        'filter[search]' => $this->customer->customer_number,
    ]))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'customer_number' => $this->customer->customer_number,
        ]);
});

it('does not filter customers by incorrect customer number', function () {
    getJson(route('v2.customers.index', [
        'filter[search]' => $this->customer->customer_number . 'Testing',
    ]))
        ->assertOk()
        ->assertJsonCount(0, ['data']);
});
