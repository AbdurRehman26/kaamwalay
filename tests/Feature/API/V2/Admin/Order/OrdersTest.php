<?php

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Events\API\Order\V2\OrderStatusChangedEvent;
use App\Exceptions\API\Admin\IncorrectOrderStatus;
use App\Jobs\Admin\Order\CreateOrderFoldersOnDropbox;
use App\Jobs\Admin\Order\GetCardGradesFromAgs;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Models\UserCard;
use Carbon\Carbon;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;

use function Pest\Laravel\deleteJson;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
        CardSeriesSeeder::class,
        CardSetsSeeder::class,
        CardProductSeeder::class,
    ]);

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();

    $this->orders = Order::factory()->count(5)->state(new Sequence(
        ['order_status_id' => OrderStatus::PLACED, 'created_at' => '2022-01-01 00:00:00'],
        ['order_status_id' => OrderStatus::CONFIRMED, 'created_at' => '2022-02-01 00:00:00'],
        ['order_status_id' => OrderStatus::GRADED, 'created_at' => '2022-03-01 00:00:00'],
        ['order_status_id' => OrderStatus::SHIPPED, 'created_at' => '2022-04-01 00:00:00'],
    ))->create();

    \App\Models\OrderStatusHistory::factory()->count(5)->sequence(
        ['order_status_id' => $this->orders[0]->order_status_id, 'order_id' => $this->orders[0]->id, 'user_id' => $this->orders[0]->user_id],
        ['order_status_id' => $this->orders[1]->order_status_id, 'order_id' => $this->orders[1]->id, 'user_id' => $this->orders[1]->user_id],
        ['order_status_id' => $this->orders[2]->order_status_id, 'order_id' => $this->orders[2]->id, 'user_id' => $this->orders[2]->user_id],
        ['order_status_id' => $this->orders[3]->order_status_id, 'order_id' => $this->orders[3]->id, 'user_id' => $this->orders[3]->user_id],
        ['order_status_id' => $this->orders[4]->order_status_id, 'order_id' => $this->orders[4]->id, 'user_id' => $this->orders[4]->user_id]
    )->create();

    OrderItem::factory()->count(5)
        ->state(new Sequence(
            [
                'order_id' => $this->orders[0]->id,
            ],
            [
                'order_id' => $this->orders[1]->id,
            ],
            [
                'order_id' => $this->orders[2]->id,
            ],
            [
                'order_id' => $this->orders[3]->id,
            ],
            [
                'order_id' => $this->orders[4]->id,
            ]
        ))
        ->create();

    UserCard::factory()->state(new Sequence(
        [
            'order_item_id' => OrderItem::first()->id,
            'certificate_number' => '000000100',
        ]
    ))->create();

    $this->paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => 1000000, 'price' => 10]);
    $this->cardProduct = CardProduct::factory()->create();
    $this->shippingMethod = ShippingMethod::factory()->insured()->create();
    $this->paymentMethod = PaymentMethod::factory()->create(['code' => 'manual']);

    $this->sampleAgsResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/AGS_card_grades_collection_200.json'
    ), associative: true);
    $this->actingAs($this->user);
});

uses()->group('admin', 'admin_orders');

it('returns orders list for admin', function () {
    $this->getJson('/api/v2/admin/orders')
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
    $this->getJson('/api/v2/admin/orders/' . $this->orders[0]->id .'?include=customer,orderItems')
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
        ->getJson('/api/v2/admin/orders/1')
        ->assertForbidden();
});

test('order details throws error for roles other than admin', function () {
    $this->actingAs(User::factory()->withRole(config('permission.roles.customer'))->create())
        ->getJson('/api/v2/admin/orders/1')
        ->assertForbidden();
});

it('filters orders by id', function () {
    $this->getJson('/api/v2/admin/orders?filter[order_id]=' . $this->orders[0]->id)
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'id' => $this->orders[0]->id,
        ]);
});

it('returns only placed orders', function () {
    $this->getJson('/api/v2/admin/orders?include=orderStatusHistory&filter[status]=placed')
        ->assertOk()
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::PLACED,
        ]);
});

it('returns only reviewed orders', function () {
    $this->getJson('/api/v2/admin/orders?include=orderStatusHistory&filter[status]=confirmed')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::CONFIRMED,
        ]);
});

it('returns only graded orders', function () {
    $this->getJson('/api/v2/admin/orders?include=orderStatusHistory&filter[status]=graded')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::GRADED,
        ]);
});

it('returns only shipped orders', function () {
    $this->getJson('/api/v2/admin/orders?include=orderStatusHistory&filter[status]=shipped')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::SHIPPED,
        ]);
});

it('returns orders order by asc order_number', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=order_number')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('order_number')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc order_number', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=-order_number')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('order_number', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc created_at', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=created_at')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('created_at')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc created_at', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=-created_at')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('created_at', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc arrived_at', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=arrived_at')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('arrived_at')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc arrived_at', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=-arrived_at')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('arrived_at', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc customer_number', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=customer_number')
        ->assertOk();
    $this->assertEquals(
        Order::join('users', 'users.id', 'orders.user_id')->orderBy('users.customer_number', 'ASC')->select('orders.*')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc customer_number', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=-customer_number')
        ->assertOk();
    $this->assertEquals(
        Order::join('users', 'users.id', 'orders.user_id')->orderBy('users.customer_number', 'DESC')->select('orders.*')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc cards number', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=cards')
        ->assertOk();
    $this->assertEquals(
        Order::withSum('orderItems', 'quantity')->orderBy('order_items_sum_quantity', 'ASC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc cards number', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=-cards')
        ->assertOk();
    $this->assertEquals(
        Order::withSum('orderItems', 'quantity')->orderBy('order_items_sum_quantity', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc status', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=status')
        ->assertOk();
    $this->assertEquals(
        Order::join('order_statuses', 'order_statuses.id', 'orders.order_status_id')->orderBy('order_statuses.name', 'ASC')->select('orders.*')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc status', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=-status')
        ->assertOk();
    $this->assertEquals(
        Order::join('order_statuses', 'order_statuses.id', 'orders.order_status_id')->orderBy('order_statuses.name', 'DESC')->select('orders.*')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc total_declared_value', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=total_declared_value')
        ->assertOk();
    $this->assertEquals(
        Order::withSum('orderItems', 'declared_value_total')->orderBy('order_items_sum_declared_value_total', 'ASC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc total_declared_value', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=-total_declared_value')
        ->assertOk();
    $this->assertEquals(
        Order::withSum('orderItems', 'declared_value_total')->orderBy('order_items_sum_declared_value_total', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc grand_total', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=grand_total')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc grand_total', function () {
    $response = $this->getJson('/api/v2/admin/orders?sort=-grand_total')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

test('orders are filterable by customer first name', function () {
    $user = $this->orders[0]->user;
    $this->getJson('/api/v2/admin/orders?include=customer&filter[customer_name]=' . $user->first_name)
        ->assertOk()
        ->assertJsonCount($user->orders->count(), ['data'])
        ->assertJsonFragment([
            'email' => $user->email,
        ]);
});

test('orders are filterable by customer ID', function () {
    $user = $this->orders[0]->user;
    $this->getJson('/api/v2/admin/orders?include=customer&filter[customer_id]=' . $user->id)
        ->assertOk()
        ->assertJsonCount($user->orders->count(), ['data'])
        ->assertJsonFragment([
            'email' => $user->email,
        ]);
});

test('an admin can update order notes', function () {
    $response = $this->putJson('/api/v2/admin/orders/' . $this->orders[0]->id . '/notes', [
        'notes' => 'Lorem Ipsum',
    ])->assertOk();
});

test('a customer can not update order notes', function () {
    $customerUser = User::factory()->withRole(config('permission.roles.customer'))->create();

    $this->actingAs($customerUser);

    $response = $this->putJson('/api/v2/admin/orders/' . $this->orders[0]->id . '/notes', [
        'notes' => 'Lorem Ipsum',
    ])->assertForbidden();
});

test('an admin can get order cards grades', function () {
    Bus::fake();

    $this->getJson('/api/v2/admin/orders/' . $this->orders[1]->id . '/grades')->assertOk();

    Bus::assertDispatched(GetCardGradesFromAgs::class);
});

test('a customer can not get order cards grades', function () {
    $customerUser = User::factory()->withRole(config('permission.roles.customer'))->create();

    $this->actingAs($customerUser);

    $this->getJson('/api/v2/admin/orders/' . $this->orders[1]->id . '/grades')
    ->assertForbidden();
});

it('can not get order grades if order is not reviewed', function () {
    $response = $this->getJson('/api/v2/admin/orders/' . $this->orders[0]->id . '/grades');
    $response->assertJsonStructure([ 'error' ]);
    $response->assertJsonPath('error', (new IncorrectOrderStatus)->getMessage());
});

it(
    'returns orders filtered after searching the order with order number, customer number and user Name',
    function (string $value) {
        $this->getJson('/api/v2/admin/orders?include=orderStatusHistory&filter[search]=' . $value)
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
    Bus::fake();
    $response = $this->postJson('/api/v2/admin/orders/' . $this->orders[0]->id . '/status-history', [
        'order_status_id' => OrderStatus::CONFIRMED,
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'data' => [
            'order_id' => $this->orders[0]->id,
            'order_status_id' => OrderStatus::CONFIRMED,
        ],
    ]);
});

test('an admin can not complete review of an order if error occurred with AGS client', function () {
    Http::fake([
        'ags.api/*/certificates/*' => Http::response([]),
    ]);

    $this->postJson('/api/v2/admin/orders/' . $this->orders[1]->id . '/status-history', [
        'order_status_id' => OrderStatus::CONFIRMED,
    ])->assertStatus(422);
});

test('it dispatches get grades from AGS job when admin fetches grades', function () {
    Bus::fake();

    UserCard::factory()->create([
        'order_item_id' => $this->orders[1]->orderItems->first()->id,
    ]);
    $this->getJson('/api/v2/admin/orders/' . $this->orders[1]->id . '/grades')
        ->assertOk()
        ->assertJsonFragment([
            'robo_grade_values' => null,
        ]);

    Bus::assertDispatched(GetCardGradesFromAgs::class);
});



test('an admin can get order cards if AGS API returns grades', function () {
    Http::fake(['*' => Http::response($this->sampleAgsResponse)]);
    $orderItemId = $this->orders[1]->orderItems->first()->id;
    UserCard::factory()->create([
        'order_item_id' => $orderItemId,
        'certificate_number' => '09000000',
    ]);
    $this->getJson('/api/v2/admin/orders/' . $this->orders[1]->id . '/grades')
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
    $response = $this->postJson('/api/v2/admin/orders/' . $order->id . '/status-history', [
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
    $this->postJson('/api/v2/admin/orders/' . $order->id . '/status-history', [
        'order_status_id' => OrderStatus::CONFIRMED,
    ]);

    Bus::assertDispatchedTimes(CreateOrderFoldersOnDropbox::class);
});

test('order can not be shipped if its not paid', function () {
    /** @var Order $order */
    $order = Order::factory()->create();
    $this->postJson('/api/v2/admin/orders/' . $order->id . '/status-history', [
        'order_status_id' => OrderStatus::SHIPPED,
    ])->assertUnprocessable();
});

test('order can be shipped if its not paid', function () {
    /** @var Order $order */
    Event::fake();
    $order = Order::factory()->create([
        'payment_status' => OrderPaymentStatusEnum::PAID,
        'order_status_id' => OrderStatus::ASSEMBLED,
    ]);
    $this->postJson('/api/v2/admin/orders/' . $order->id . '/status-history', [
        'order_status_id' => OrderStatus::SHIPPED,
    ])->assertOk();

    Event::assertDispatched(OrderStatusChangedEvent::class);
});

test('order can be cancelled if it is not paid', function () {
    Event::fake();
    /** @var Order $order */
    $order = Order::factory()->create();
    deleteJson('/api/v2/admin/orders/' . $order->id)->assertNoContent();
    $order->refresh();
    expect($order->isCancelled())->toBeTrue();
});

test('order can not be cancelled if it is paid', function () {
    /** @var Order $order */
    $order = Order::factory()->create(['payment_status' => OrderPaymentStatusEnum::PAID]);
    deleteJson('/api/v2/admin/orders/' . $order->id)->assertUnprocessable();
    $order->refresh();
    expect($order->isCancelled())->toBeFalse();
});

test('order can not be cancelled if it is already cancelled', function () {
    /** @var Order $order */
    $order = Order::factory()->create(['order_status_id' => OrderStatus::CANCELLED]);
    deleteJson('/api/v2/admin/orders/' . $order->id)->assertUnprocessable();
});

it('returns only orders with filtered payment status', function ($data) {
    $this->orders = Order::factory()->count(3)->state(new Sequence(
        ['id' => 100, 'payment_status' => OrderPaymentStatusEnum::PENDING],
        ['id' => 101, 'payment_status' => OrderPaymentStatusEnum::PAID],
        ['id' => 102, 'payment_status' => OrderPaymentStatusEnum::DUE],
    ))->create();

    $this->getJson('/api/v2/admin/orders?filter[payment_status]=' . $data['payment_status'])
        ->assertOk()
        ->assertJsonCount($data['count'], ['data'])
        ->assertJsonFragment([
            'id' => $data['id'], 'payment_status' => $data['payment_status'],
        ]);
})->with([
    fn () => ['id' => 100, 'count' => 6, 'payment_status' => OrderPaymentStatusEnum::PENDING->value],
    fn () => ['id' => 101, 'count' => 1, 'payment_status' => OrderPaymentStatusEnum::PAID->value],
    fn () => ['id' => 102, 'count' => 1, 'payment_status' => OrderPaymentStatusEnum::DUE->value],
]);

it('admin can mark graded order as assembled', function () {
    Event::fake();
    Bus::fake();

    /** @var Order $order */
    $order = Order::factory()->create([
        'order_status_id' => OrderStatus::GRADED,
    ]);
    $this->postJson('/api/v2/admin/orders/' . $order->id . '/status-history', [
        'order_status_id' => OrderStatus::ASSEMBLED,
    ])->assertOk();
});

it('admin can not mark ungraded order as assembled', function () {
    Event::fake();
    Bus::fake();

    /** @var Order $order */
    $order = Order::factory()->create([
        'order_status_id' => OrderStatus::CONFIRMED,
    ]);
    $this->postJson('/api/v2/admin/orders/' . $order->id . '/status-history', [
        'order_status_id' => OrderStatus::ASSEMBLED,
    ])->assertUnprocessable();
});

it('calculates estimated delivery date when admins marks the order as reviewed', function () {
    Event::fake();
    Bus::fake();
    Http::fake([
        'ags.api/*/certificates/*' => Http::response(['data']),
    ]);

    $order = Order::factory()->create();
    $paymentPlan = $order->originalPaymentPlan;

    $estimatedDeliveryStartAt = Carbon::now()->addWeekdays($paymentPlan->estimated_delivery_days_min);
    $estimatedDeliveryEndAt = Carbon::now()->addWeekdays($paymentPlan->estimated_delivery_days_max);

    $this->postJson('/api/v2/admin/orders/' . $order->id . '/status-history', [
        'order_status_id' => OrderStatus::CONFIRMED,
    ])->assertOk();

    $order->refresh();

    expect($order->estimated_delivery_start_at->toDateTimeString())->toBe($estimatedDeliveryStartAt->toDateTimeString())
        ->and($order->estimated_delivery_end_at->toDateTimeString())->toBe($estimatedDeliveryEndAt->toDateTimeString());
});

test('an admin can place order for an user', function () {
    Event::fake();

    $customer = User::factory()->create();

    $response = $this->postJson('/api/v2/admin/orders', [
        'user_id' => $customer->id,
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
        'items' => [
            [
                'card_product' => [
                    'id' => $this->cardProduct->id,
                ],
                'quantity' => 1,
                'declared_value_per_unit' => 500,
            ],
            [
                'card_product' => [
                    'id' => $this->cardProduct->id,
                ],
                'quantity' => 1,
                'declared_value_per_unit' => 500,
            ],
        ],
        'shipping_address' => [
            'first_name' => 'First',
            'last_name' => 'Last',
            'address' => 'Test address',
            'city' => 'Test',
            'state' => 'AB',
            'zip' => '12345',
            'phone' => '1234567890',
            'flat' => '43',
            'save_for_later' => true,
        ],
        'billing_address' => [
            'first_name' => 'First',
            'last_name' => 'Last',
            'address' => 'Test address',
            'city' => 'Test',
            'state' => 'AB',
            'zip' => '12345',
            'phone' => '1234567890',
            'flat' => '43',
            'same_as_shipping' => true,
        ],
        'customer_address' => [
            'id' => null,
        ],
        'shipping_method' => [
            'id' => $this->shippingMethod->id,
        ],
        'pay_now' => false,
    ]);
    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'id',
            'order_number',
            'order_items',
            'payment_plan',
            'order_payment',
            'billing_address',
            'shipping_address',
            'shipping_method',
            'service_fee',
            'shipping_fee',
            'grand_total',
            'user',
            'created_by',
        ],
    ]);
    $response->assertJsonPath('data.user.id', $customer->id);
    $response->assertJsonPath('data.created_by.id', $this->user->id);
});

test('an admin can place order for an user and mark it paid immediately', function () {
    Event::fake();

    $customer = User::factory()->create();

    $response = $this->postJson('/api/v2/admin/orders', [
        'user_id' => $customer->id,
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
        'items' => [
            [
                'card_product' => [
                    'id' => $this->cardProduct->id,
                ],
                'quantity' => 1,
                'declared_value_per_unit' => 500,
            ],
            [
                'card_product' => [
                    'id' => $this->cardProduct->id,
                ],
                'quantity' => 1,
                'declared_value_per_unit' => 500,
            ],
        ],
        'shipping_address' => [
            'first_name' => 'First',
            'last_name' => 'Last',
            'address' => 'Test address',
            'city' => 'Test',
            'state' => 'AB',
            'zip' => '12345',
            'phone' => '1234567890',
            'flat' => '43',
            'save_for_later' => true,
        ],
        'billing_address' => [
            'first_name' => 'First',
            'last_name' => 'Last',
            'address' => 'Test address',
            'city' => 'Test',
            'state' => 'AB',
            'zip' => '12345',
            'phone' => '1234567890',
            'flat' => '43',
            'same_as_shipping' => true,
        ],
        'customer_address' => [
            'id' => null,
        ],
        'shipping_method' => [
            'id' => $this->shippingMethod->id,
        ],
        'pay_now' => true,
        'payment_method' => [
            'id' => $this->paymentMethod->id,
        ],
    ]);
    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'id',
            'order_number',
            'order_items',
            'payment_plan',
            'order_payment',
            'billing_address',
            'shipping_address',
            'shipping_method',
            'service_fee',
            'shipping_fee',
            'grand_total',
        ],
    ]);
});
