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
    $this->getJson('api/admin/orders/1?include=customer')
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

it('filters orders by id', function () {
    $this->getJson('/api/admin/orders?filter[order_id]=' . $this->orders[0]->id)
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'id' => $this->orders[0]->id,
        ]);
})->group('admin', 'admin_orders');

it('returns only placed orders', function () {
    $this->getJson('/api/admin/orders?filter[status]=placed')
        ->assertOk()
        ->assertJsonFragment([
            'status' => OrderStatus::find(2)->name,
        ])
        ->assertJsonMissing([
            'status' => OrderStatus::find(1)->name,
        ]);
})->group('admin', 'admin_orders');

it('returns only reviewed orders', function () {
    $this->getJson('/api/admin/orders?filter[status]=reviewed')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'status' => OrderStatus::find(7)->name,
        ]);
})->group('admin', 'admin_orders');

it('returns only graded orders', function () {
    $this->getJson('/api/admin/orders?filter[status]=graded')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'status' => OrderStatus::find(4)->name,
        ]);
})->group('admin', 'admin_orders');

it('returns only shipped orders', function () {
    $this->getJson('/api/admin/orders?filter[status]=shipped')
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

test('orders are filterable by customer first name', function () {
    $user = $this->orders[0]->user;
    $this->getJson('/api/admin/orders?filter[customer_name]=' . $user->first_name)
        ->assertOk()
        ->assertJsonCount($user->orders->count(), ['data'])
        ->assertJsonFragment([
            'customer' => $user->email,
        ]);
})->group('admin', 'admin_orders');

test('orders are filterable by customer ID', function () {
    $user = $this->orders[0]->user;
    $this->getJson('/api/admin/orders?filter[customer_id]=' . $user->id)
        ->assertOk()
        ->assertJsonCount($user->orders->count(), ['data'])
        ->assertJsonFragment([
            'customer' => $user->email,
        ]);
})->group('admin', 'admin_orders');

test('an admin can update order notes', function () {
    $response = $this->putJson('/api/admin/orders/' . $this->orders[0]->id . '/notes', [
        'notes' => 'Lorem Ipsum',
    ])->assertOk();
})->group('admin', 'admin_orders');

test('a customer can not update order notes', function () {
    $customerUser = User::factory()->withRole(config('permission.roles.customer'))->create();

    $this->actingAs($customerUser);

    $response = $this->putJson('/api/admin/orders/' . $this->orders[0]->id . '/notes', [
        'notes' => 'Lorem Ipsum',
    ])->assertForbidden();
})->group('admin', 'admin_orders');
