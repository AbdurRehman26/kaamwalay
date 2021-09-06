<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\User;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
        CardSeriesSeeder::class,
        CardSetsSeeder::class,
        CardProductSeeder::class,
    ]);
    $this->orders = Order::factory()->count(5)->state(new Sequence(
        [
            'order_status_id' => 2,
        ],
        [
            'order_status_id' => 3,
        ],
        [
            'order_status_id' => 4,
        ],
        [
            'order_status_id' => 5,
        ],
        [
            'order_status_id' => 7,
        ],
    ))->create();
    OrderItem::factory()->count(2)
        ->state(new Sequence(
            [
                'order_id' => $this->orders[0]->id,
            ],
            [
                'order_id' => $this->orders[1]->id,
            ]
        ))
        ->create([
            'order_id' => $this->orders[0],
        ]);
    $user = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->actingAs($user);
});

it('returns orders list for admin', function () {
    $this->getJson('/api/admin/orders')
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                [
                    'id',
                    'order_number',
                    'arrived',
                    'status',
                    'created_at',
                ],
            ],
        ]);
})->group('admin', 'admin_orders');

it('returns order details', function () {
    $this->getJson('api/admin/orders/1')
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'id',
                'order_number',
                'status',
                'created_at',
                'customer',
                'order_items',
            ],
        ]);
})->group('admin', 'admin_orders');

test('orders throws error for roles other than admin', function () {
    $this->actingAs(User::factory()->withRole(config('permission.roles.customer'))->create())
        ->getJson('api/admin/orders/1')
        ->assertForbidden();
})->group('admin', 'admin_orders');

test('order details throws error for roles other than admin', function () {
    $this->actingAs(User::factory()->withRole(config('permission.roles.customer'))->create())
        ->getJson('api/admin/orders/1')
        ->assertForbidden();
})->group('admin', 'admin_orders');

it('filters orders by order number', function () {
    $this->getJson('/api/admin/orders?filter[order_number]=' . $this->orders[0]->order_number)
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_number' => $this->orders[0]->order_number,
        ]);
})->group('admin', 'admin_orders');

it('filters orders by id', function () {
    $this->getJson('/api/admin/orders?filter[id]=' . $this->orders[0]->id)
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'id' => $this->orders[0]->id,
        ]);
})->group('admin', 'admin_orders');

it('returns only placed orders', function () {
    $this->getJson('/api/admin/orders?filter[status_code]=placed')
        ->assertOk()
        ->assertJsonFragment([
            'status' => OrderStatus::find(2)->name,
        ])
        ->assertJsonMissing([
            'status' => OrderStatus::find(1)->name,
        ]);
})->group('admin', 'admin_orders');

it('returns only reviewed orders', function () {
    $this->getJson('/api/admin/orders?filter[status_code]=reviewed')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'status' => OrderStatus::find(7)->name,
        ]);
})->group('admin', 'admin_orders');

it('returns only graded orders', function () {
    $this->getJson('/api/admin/orders?filter[status_code]=graded')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'status' => OrderStatus::find(4)->name,
        ]);
})->group('admin', 'admin_orders');

it('returns only shipped orders', function () {
    $this->getJson('/api/admin/orders?filter[status_code]=shipped')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'status' => OrderStatus::find(5)->name,
        ]);
})->group('admin', 'admin_orders');

it('returns orders order by asc grand_total', function () {
    $response = $this->getJson('/api/admin/orders?sort=grand_total')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
})->group('admin', 'admin_orders');

it('returns orders order by desc grand_total', function () {
    $response = $this->getJson('/api/admin/orders?sort=-grand_total')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
})->group('admin', 'admin_orders');
