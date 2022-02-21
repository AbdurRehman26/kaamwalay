<?php

use App\Events\API\Order\OrderStatusChangedEvent;
use App\Exceptions\API\Admin\IncorrectOrderStatus;
use App\Jobs\Admin\Order\CreateOrderFoldersOnDropbox;
use App\Jobs\Admin\Order\CreateOrderLabel;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\User;
use App\Models\UserCard;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Facades\Event;
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
        ['id' => 1, 'order_status_id' => OrderStatus::PLACED],
        ['id' => 2, 'order_status_id' => OrderStatus::CONFIRMED],
        ['id' => 3, 'order_status_id' => OrderStatus::GRADED],
        ['id' => 4, 'order_status_id' => OrderStatus::SHIPPED],
        ['id' => 5, 'order_status_id' => OrderStatus::REVIEWED]
    ))->create();

    \App\Models\OrderStatusHistory::factory()->count(5)->sequence(
        ['order_status_id' => $this->orders[0]->order_status_id, 'order_id' => $this->orders[0]->id, 'user_id' => $this->orders[0]->user_id],
        ['order_status_id' => $this->orders[1]->order_status_id, 'order_id' => $this->orders[1]->id, 'user_id' => $this->orders[1]->user_id],
        ['order_status_id' => $this->orders[2]->order_status_id, 'order_id' => $this->orders[2]->id, 'user_id' => $this->orders[2]->user_id],
        ['order_status_id' => $this->orders[3]->order_status_id, 'order_id' => $this->orders[3]->id, 'user_id' => $this->orders[3]->user_id],
        ['order_status_id' => $this->orders[4]->order_status_id, 'order_id' => $this->orders[4]->id, 'user_id' => $this->orders[4]->user_id]
    )->create();

    OrderItem::factory()->count(2)
        ->state(new Sequence(
            [
                'id' => 1,
                'order_id' => $this->orders[0]->id,
            ],
            [
                'id' => 2,
                'order_id' => $this->orders[1]->id,
            ]
        ))
        ->create();

    UserCard::factory()->state(new Sequence(
        [
            'order_item_id' => 1,
            'certificate_number' => '000000100',
        ]
    ))->create();

    $this->sampleAgsResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/AGS_card_grades_collection_200.json'
    ), associative: true);
    $this->actingAs($user);
});

uses()->group('admin', 'admin_orders');

it('returns orders list for admin', function () {
    $this->getJson('/api/v1/admin/orders')
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
    $this->getJson('/api/v1/admin/orders/1?include=customer,orderItems')
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'id',
                'order_number',
                'created_at',
                'customer',
                'order_items',
            ],
        ])
        ->assertJsonFragment([
            'refund_total' => 0,
            'extra_charge_total' => 0,
        ]);
});

test('orders throws error for roles other than admin', function () {
    $this->actingAs(User::factory()->withRole(config('permission.roles.customer'))->create())
        ->getJson('/api/v1/admin/orders/1')
        ->assertForbidden();
});

test('order details throws error for roles other than admin', function () {
    $this->actingAs(User::factory()->withRole(config('permission.roles.customer'))->create())
        ->getJson('/api/v1/admin/orders/1')
        ->assertForbidden();
});

it('filters orders by id', function () {
    $this->getJson('/api/v1/admin/orders?filter[order_id]=' . $this->orders[0]->id)
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'id' => $this->orders[0]->id,
        ]);
});

it('returns only placed orders', function () {
    $this->getJson('/api/v1/admin/orders?include=orderStatusHistory&filter[status]=placed')
        ->assertOk()
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::PLACED,
        ]);
});

it('returns only reviewed orders', function () {
    $this->getJson('/api/v1/admin/orders?include=orderStatusHistory&filter[status]=reviewed')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::REVIEWED,
        ]);
});

it('returns only graded orders', function () {
    $this->getJson('/api/v1/admin/orders?include=orderStatusHistory&filter[status]=graded')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::GRADED,
        ]);
});

it('returns only shipped orders', function () {
    $this->getJson('/api/v1/admin/orders?include=orderStatusHistory&filter[status]=shipped')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::SHIPPED,
        ]);
});

it('returns orders order by asc grand_total', function () {
    $response = $this->getJson('/api/v1/admin/orders?sort=grand_total')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc grand_total', function () {
    $response = $this->getJson('/api/v1/admin/orders?sort=-grand_total')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

test('orders are filterable by customer first name', function () {
    $user = $this->orders[0]->user;
    $this->getJson('/api/v1/admin/orders?include=customer&filter[customer_name]=' . $user->first_name)
        ->assertOk()
        ->assertJsonCount($user->orders->count(), ['data'])
        ->assertJsonFragment([
            'email' => $user->email,
        ]);
});

test('orders are filterable by customer ID', function () {
    $user = $this->orders[0]->user;
    $this->getJson('/api/v1/admin/orders?include=customer&filter[customer_id]=' . $user->id)
        ->assertOk()
        ->assertJsonCount($user->orders->count(), ['data'])
        ->assertJsonFragment([
            'email' => $user->email,
        ]);
});

test('an admin can update order notes', function () {
    $response = $this->putJson('/api/v1/admin/orders/' . $this->orders[0]->id . '/notes', [
        'notes' => 'Lorem Ipsum',
    ])->assertOk();
});

test('a customer can not update order notes', function () {
    $customerUser = User::factory()->withRole(config('permission.roles.customer'))->create();

    $this->actingAs($customerUser);

    $response = $this->putJson('/api/v1/admin/orders/' . $this->orders[0]->id . '/notes', [
        'notes' => 'Lorem Ipsum',
    ])->assertForbidden();
});

test('an admin can get order cards grades', function () {
    Http::fake(['*' => Http::response($this->sampleAgsResponse, 200, [])]);
    $this->getJson('/api/v1/admin/orders/' . $this->orders[1]->id . '/grades')
    ->assertOk();
});

test('a customer can not get order cards grades', function () {
    $customerUser = User::factory()->withRole(config('permission.roles.customer'))->create();

    $this->actingAs($customerUser);

    Http::fake(['*' => Http::response($this->sampleAgsResponse, 200, [])]);

    $this->getJson('/api/v1/admin/orders/' . $this->orders[1]->id . '/grades')
    ->assertForbidden();
});

it('can not get order grades if order is not reviewed', function () {
    Http::fake(['*' => Http::response($this->sampleAgsResponse, 200, [])]);
    $response = $this->getJson('/api/v1/admin/orders/' . $this->orders[0]->id . '/grades');
    $response->assertJsonStructure([ 'error' ]);
    $response->assertJsonPath('error', (new IncorrectOrderStatus)->getMessage());
});

it(
    'returns orders filtered after searching the order with order number, customer number and user Name',
    function (string $value) {
        $this->getJson('/api/v1/admin/orders?include=orderStatusHistory&filter[search]=' . $value)
            ->assertOk()
            ->assertJsonFragment([
                'id' => $this->orders[0]->id,
            ]);
    }
)->with([
    fn () => $this->orders[0]->order_number,
    fn () => $this->orders[0]->user->customer_number,
    fn () => $this->orders[0]->user->first_name,
    fn () => '000000100', // cert number of the first order's first item
]);

test('an admin can complete review of an order', function () {
    Http::fake([
        'ags.api/*/certificates/*' => Http::response(['data']),
    ]);
    $response = $this->postJson('/api/v1/admin/orders/' . $this->orders[0]->id . '/status-history', [
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

    $this->postJson('/api/v1/admin/orders/' . $this->orders[1]->id . '/status-history', [
        'order_status_id' => OrderStatus::CONFIRMED,
    ])->assertStatus(422);
});

test('an admin can get order cards if AGS API fails to return grades', function () {
    Http::fake(['*' => Http::response([])]);
    \App\Models\UserCard::factory()->create([
        'order_item_id' => $this->orders[1]->orderItems->first()->id,
    ]);
    $this->getJson('/api/v1/admin/orders/' . $this->orders[1]->id . '/grades')
        ->assertOk()
        ->assertJsonFragment([
            'robo_grade_values' => null,
        ]);
});



test('an admin can get order cards if AGS API returns grades', function () {
    Http::fake(['*' => Http::response($this->sampleAgsResponse)]);
    $orderItemId = $this->orders[1]->orderItems->first()->id;
    \App\Models\UserCard::factory()->create([
        'order_item_id' => $orderItemId,
        'certificate_number' => '09000000',
    ]);
    $this->getJson('/api/v1/admin/orders/' . $this->orders[1]->id . '/grades')
        ->assertJsonFragment([
                'center' => '2.00',
        ])
        ->assertJsonFragment([
            'id' => $orderItemId,
        ]);
});

it('should send an event when order status gets changed', function () {
    Event::fake();
    Http::fake(['*' => Http::response($this->sampleAgsResponse)]);
    Bus::fake();

    /** @var Order $order */
    $order = Order::factory()->create();
    $response = $this->postJson('/api/v1/admin/orders/' . $order->id . '/status-history', [
        'order_status_id' => OrderStatus::CONFIRMED,
    ]);

    $response->assertSuccessful();
    Event::assertDispatched(function (OrderStatusChangedEvent $event) use ($order) {
        return $event->order->id === $order->id && $event->orderStatus->id === OrderStatus::CONFIRMED;
    });
});

it('dispatches job for creating folders on dropbox when an order is reviewed', function () {
    Event::fake();
    Http::fake(['*' => Http::response($this->sampleAgsResponse)]);
    Bus::fake();

    /** @var Order $order */
    $order = Order::factory()->create();
    $this->postJson('/api/v1/admin/orders/' . $order->id . '/status-history', [
        'order_status_id' => OrderStatus::CONFIRMED,
    ]);

    Bus::assertDispatchedTimes(CreateOrderFoldersOnDropbox::class);
});

it('dispatches job for creating files for order labels when order is marked as graded', function () {
    Event::fake();
    Http::fake(['*' => Http::response($this->sampleAgsResponse)]);
    Bus::fake();

    /** @var Order $order */
    $order = Order::factory()->create();
    $this->postJson('/api/v1/admin/orders/' . $order->id . '/status-history', [
        'order_status_id' => OrderStatus::GRADED,
    ]);

    Bus::assertDispatchedTimes(CreateOrderLabel::class);
});
