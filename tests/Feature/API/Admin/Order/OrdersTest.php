<?php

use App\Models\User;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;

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
    $response = $this->getJson('/api/admin/orders');
    $response->assertOk();
    $response->assertJsonStructure([
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
    $response = $this->getJson('api/admin/orders/1');

    $response->assertOk();
    $response->assertJsonStructure([
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
    $this->actingAs(User::factory()->withRole(config('permission.roles.customer'))->create());
    $response = $this->getJson('api/admin/orders/1');

    $response->assertForbidden();
})->group('admin', 'admin_orders');

test('order details throws error for roles other than admin', function () {
    $this->actingAs(User::factory()->withRole(config('permission.roles.customer'))->create());
    $response = $this->getJson('api/admin/orders/1');

    $response->assertForbidden();
})->group('admin', 'admin_orders');

it('filters orders by order number', function () {
    $response = $this->getJson('/api/admin/orders?filter[order_number]=' . $this->orders[0]->order_number);

    $response->assertOk();
    $response->assertJsonCount(1, ['data']);
    $response->assertJsonFragment([
        'order_number' => $this->orders[0]->order_number,
    ]);
    $response->assertJsonMissing([
        'order_number' => $this->orders[1]->order_number,
    ]);
})->group('admin', 'admin_orders');

it('filters orders by id', function () {
    $response = $this->getJson('/api/admin/orders?filter[id]=' . $this->orders[0]->id);

    $response->assertOk();
    $response->assertJsonCount(1, ['data']);
    $response->assertJsonFragment([
        'id' => $this->orders[0]->id,
    ]);
    $response->assertJsonMissing([
        'id' => $this->orders[1]->id,
    ]);
})->group('admin', 'admin_orders');

it('returns only pending(placed) orders', function () {
    $response = $this->getJson('/api/admin/orders?filter[order_status_id]=2');

    $response->assertOk();
    $response->assertJsonFragment([
        'status' => OrderStatus::find(2)->name,
    ]);
    $response->assertJsonMissing([
        'status' => OrderStatus::find(1)->name,
    ]);
})->group('admin', 'admin_orders');

it('returns only reviewed orders', function () {
    $response = $this->getJson('/api/admin/orders?filter[order_status_id]=7');

    $response->assertOk();
    $response->assertJsonCount(1, ['data']);
    $response->assertJsonFragment([
        'status' => OrderStatus::find(7)->name,
    ]);
})->group('admin', 'admin_orders');

it('returns orders order by asc grand_total', function () {
    $response = $this->getJson('/api/admin/orders?sort=grand_total');

    $response->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
})->group('admin', 'admin_orders');

it('returns orders order by desc grand_total', function () {
    $response = $this->getJson('/api/admin/orders?sort=-grand_total');

    $response->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
})->group('admin', 'admin_orders');
