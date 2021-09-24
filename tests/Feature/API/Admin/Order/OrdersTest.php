<?php

use App\Exceptions\API\Admin\IncorrectOrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Admin\OrderStatusHistoryService;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
        CardSeriesSeeder::class,
        CardSetsSeeder::class,
        CardProductSeeder::class,
    ]);

    $user = User::factory()->withRole(config('permission.roles.admin'))->create();

    $this->orders = Order::factory()->count(5)->state(new Sequence(
        ['order_status_id' => OrderStatus::PLACED],
        ['order_status_id' => OrderStatus::ARRIVED],
        ['order_status_id' => OrderStatus::GRADED],
        ['order_status_id' => OrderStatus::SHIPPED],
        ['order_status_id' => OrderStatus::REVIEWED]
    ))->create();

    \App\Models\OrderStatusHistory::factory()->count(5)->sequence(
        ['order_status_id' => $this->orders[0]->order_status_id, 'order_id' => $this->orders[0]->id, 'user_id' => $this->orders[0]->user_id],
        ['order_status_id' => $this->orders[1]->order_status_id, 'order_id' => $this->orders[1]->id, 'user_id' => $this->orders[1]->user_id],
        ['order_status_id' => $this->orders[2]->order_status_id, 'order_id' => $this->orders[2]->id, 'user_id' => $this->orders[2]->user_id],
        ['order_status_id' => $this->orders[3]->order_status_id, 'order_id' => $this->orders[3]->id, 'user_id' => $this->orders[3]->user_id],
        ['order_status_id' => $this->orders[4]->order_status_id, 'order_id' => $this->orders[4]->id, 'user_id' => $this->orders[4]->user_id]
    )->create();

//    $orderStatusHistoryService = resolve(OrderStatusHistoryService::class);
//    $this->orders->each(function ($order) use ($orderStatusHistoryService) {
//        $orderStatusHistoryService->addStatusToOrder($order->order_status_id, $order->id, $order->user_id);
//    });

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

    $this->sampleAgsResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/AGS_card_grades_collection_200.json'
    ), associative: true);
    $this->actingAs($user);
});

uses()->group('admin', 'admin_orders');

it('returns orders list for admin', function () {
    $this->getJson('/api/admin/orders')
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                [
                    'id',
                    'order_number',
                    'arrived',
                    'created_at',
                ],
            ],
        ]);
});

it('returns order details', function () {
    $this->getJson('api/admin/orders/1?include=customer,orderItems')
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'id',
                'order_number',
                'created_at',
                'customer',
                'order_items',
            ],
        ]);
});

test('orders throws error for roles other than admin', function () {
    $this->actingAs(User::factory()->withRole(config('permission.roles.customer'))->create())
        ->getJson('api/admin/orders/1')
        ->assertForbidden();
});

test('order details throws error for roles other than admin', function () {
    $this->actingAs(User::factory()->withRole(config('permission.roles.customer'))->create())
        ->getJson('api/admin/orders/1')
        ->assertForbidden();
});

it('filters orders by id', function () {
    $this->getJson('/api/admin/orders?filter[order_id]=' . $this->orders[0]->id)
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'id' => $this->orders[0]->id,
        ]);
});

it('returns only placed orders', function () {
    $this->getJson('/api/admin/orders?include=order_status_history&filter[status]=placed')
        ->assertOk()
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::PLACED,
        ]);
});

it('returns only reviewed orders', function () {
    $this->getJson('/api/admin/orders?include=order_status_history&filter[status]=reviewed')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::REVIEWED,
        ]);
});

it('returns only graded orders', function () {
    $this->getJson('/api/admin/orders?include=order_status_history&filter[status]=graded')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::GRADED,
        ]);
});

it('returns only shipped orders', function () {
    $this->getJson('/api/admin/orders?include=order_status_history&filter[status]=shipped')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::SHIPPED,
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

test('orders are filterable by customer first name', function () {
    $user = $this->orders[0]->user;
    $this->getJson('/api/admin/orders?include=customer&filter[customer_name]=' . $user->first_name)
        ->assertOk()
        ->assertJsonCount($user->orders->count(), ['data'])
        ->assertJsonFragment([
            'email' => $user->email,
        ]);
});

test('orders are filterable by customer ID', function () {
    $user = $this->orders[0]->user;
    $this->getJson('/api/admin/orders?include=customer&filter[customer_id]=' . $user->id)
        ->assertOk()
        ->assertJsonCount($user->orders->count(), ['data'])
        ->assertJsonFragment([
            'email' => $user->email,
        ]);
});

test('an admin can update order notes', function () {
    $response = $this->putJson('/api/admin/orders/' . $this->orders[0]->id . '/notes', [
        'notes' => 'Lorem Ipsum',
    ])->assertOk();
});

test('a customer can not update order notes', function () {
    $customerUser = User::factory()->withRole(config('permission.roles.customer'))->create();

    $this->actingAs($customerUser);

    $response = $this->putJson('/api/admin/orders/' . $this->orders[0]->id . '/notes', [
        'notes' => 'Lorem Ipsum',
    ])->assertForbidden();
});

test('an admin can get order cards grades', function () {
    Http::fake(['*' => Http::response($this->sampleAgsResponse, 200, [])]);
    $this->getJson('/api/admin/orders/' . $this->orders[1]->id . '/grades')
    ->assertOk();
});

test('a customer can not get order cards grades', function () {
    $customerUser = User::factory()->withRole(config('permission.roles.customer'))->create();

    $this->actingAs($customerUser);

    Http::fake(['*' => Http::response($this->sampleAgsResponse, 200, [])]);

    $this->getJson('/api/admin/orders/' . $this->orders[1]->id . '/grades')
    ->assertForbidden();
});

it('can not get order grades if order is not reviewed', function () {
    Http::fake(['*' => Http::response($this->sampleAgsResponse, 200, [])]);
    $response = $this->getJson('/api/admin/orders/' . $this->orders[0]->id . '/grades');
    $response->assertJsonStructure([ 'error' ]);
    $response->assertJsonPath('error', (new IncorrectOrderStatus)->getMessage());
});

it('returns orders filtered after searching the order ID', function (string $value) {
    $this->getJson('/api/admin/orders?include=order_status_history&filter[search]=' . $value)
        ->assertOk()
        ->assertJsonFragment([
            'id' => $this->orders[0]->id,
        ]);
})->with([
    fn () => $this->orders[0]->order_number,
    fn () => $this->orders[0]->user->id,
    fn () => $this->orders[0]->user->first_name,
]);

test('an admin can complete review of an order', function () {
    Http::fake([
        'ags.api/*/certificates/*' => Http::response(['data']),
    ]);
    $response = $this->postJson('/api/admin/orders/' . $this->orders[0]->id . '/status-history', [
        'order_status_id' => OrderStatus::REVIEWED,
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'data' => [
            'order_id' => $this->orders[0]->id,
            'order_status_id' => OrderStatus::REVIEWED,
        ],
    ]);
});

test('an admin can not complete review of an order if error occurred with AGS client', function () {
    Http::fake([
        'ags.api/*/certificates/*' => Http::response([]),
    ]);

    $this->postJson('/api/admin/orders/' . $this->orders[1]->id . '/status-history', [
        'order_status_id' => OrderStatus::ARRIVED,
    ])->assertStatus(422);
});
