<?php

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
        CardSeriesSeeder::class,
        CardSetsSeeder::class,
        CardProductSeeder::class,
    ]);

    $this->user = User::factory()->withSalesmanRole()->create();

    $this->orders = Order::factory()->count(5)->state(new Sequence(
        ['order_status_id' => OrderStatus::PLACED, 'salesman_id' => $this->user->id, 'created_at' => '2022-01-01 00:00:00'],
        ['order_status_id' => OrderStatus::CONFIRMED, 'salesman_id' => $this->user->id, 'created_at' => '2022-02-01 00:00:00'],
        ['order_status_id' => OrderStatus::GRADED, 'salesman_id' => $this->user->id, 'created_at' => '2022-03-01 00:00:00'],
        ['order_status_id' => OrderStatus::SHIPPED, 'salesman_id' => $this->user->id, 'created_at' => '2022-04-01 00:00:00'],
    ))->create();

    \App\Models\OrderStatusHistory::factory()->count(5)->sequence(
        ['order_status_id' => $this->orders[0]->order_status_id, 'order_id' => $this->orders[0]->id, 'user_id' => $this->orders[0]->user_id],
        ['order_status_id' => $this->orders[1]->order_status_id, 'order_id' => $this->orders[1]->id, 'user_id' => $this->orders[1]->user_id],
        ['order_status_id' => $this->orders[2]->order_status_id, 'order_id' => $this->orders[2]->id, 'user_id' => $this->orders[2]->user_id],
        ['order_status_id' => $this->orders[3]->order_status_id, 'order_id' => $this->orders[3]->id, 'user_id' => $this->orders[3]->user_id],
        ['order_status_id' => $this->orders[4]->order_status_id, 'order_id' => $this->orders[4]->id, 'user_id' => $this->orders[4]->user_id]
    )->create();

    $this->paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => 1000000, 'price' => 10]);
    $this->cardProduct = CardProduct::factory()->create();
    $this->shippingMethod = ShippingMethod::factory()->insured()->create();
    $this->paymentMethod = PaymentMethod::factory()->create(['code' => 'manual']);

    actingAs($this->user);
});

uses()->group('salesman', 'salesman_orders');

it('returns orders list for salesman', function () {
    $this->getJson('/api/v2/salesman/orders')
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
    $this->getJson('/api/v2/salesman/orders/' . $this->orders[0]->id .'?include=customer,orderItems')
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

test('orders throws error for roles other than salesman', function () {

    $this->actingAs(User::factory()->withRole(config('permission.roles.customer'))->create())
        ->getJson('/api/v2/salesman/orders/1')
        ->assertForbidden();

    $this->actingAs(User::factory()->withRole(config('permission.roles.admin'))->create())
        ->getJson('/api/v2/salesman/orders/1')
        ->assertForbidden();
});

it('filters orders by id', function () {
    $this->getJson('/api/v2/salesman/orders?filter[order_id]=' . $this->orders[0]->id)
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'id' => $this->orders[0]->id,
        ]);
});

it('returns only placed orders', function () {
    $this->getJson('/api/v2/salesman/orders?include=orderStatusHistory&filter[status]=placed')
        ->assertOk()
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::PLACED,
        ]);
});

it('returns only reviewed orders', function () {
    $this->getJson('/api/v2/salesman/orders?include=orderStatusHistory&filter[status]=confirmed')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::CONFIRMED,
        ]);
});

it('returns only graded orders', function () {
    $this->getJson('/api/v2/salesman/orders?include=orderStatusHistory&filter[status]=graded')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::GRADED,
        ]);
});

it('returns only shipped orders', function () {
    $this->getJson('/api/v2/salesman/orders?include=orderStatusHistory&filter[status]=shipped')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::SHIPPED,
        ]);
});

it('returns orders order by asc order_number', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=order_number')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('order_number')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc order_number', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=-order_number')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('order_number', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc created_at', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=created_at')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('created_at')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc created_at', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=-created_at')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('created_at', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc arrived_at', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=arrived_at')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('arrived_at')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc arrived_at', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=-arrived_at')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('arrived_at', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc customer_number', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=customer_number')
        ->assertOk();
    $this->assertEquals(
        Order::join('users', 'users.id', 'orders.user_id')->orderBy('users.customer_number', 'ASC')->select('orders.*')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc customer_number', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=-customer_number')
        ->assertOk();
    $this->assertEquals(
        Order::join('users', 'users.id', 'orders.user_id')->orderBy('users.customer_number', 'DESC')->select('orders.*')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc cards number', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=cards')
        ->assertOk();
    $this->assertEquals(
        Order::withSum('orderItems', 'quantity')->orderBy('order_items_sum_quantity', 'ASC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc cards number', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=-cards')
        ->assertOk();
    $this->assertEquals(
        Order::withSum('orderItems', 'quantity')->orderBy('order_items_sum_quantity', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc status', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=status')
        ->assertOk();
    $this->assertEquals(
        Order::join('order_statuses', 'order_statuses.id', 'orders.order_status_id')->orderBy('order_statuses.name', 'ASC')->select('orders.*')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc status', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=-status')
        ->assertOk();
    $this->assertEquals(
        Order::join('order_statuses', 'order_statuses.id', 'orders.order_status_id')->orderBy('order_statuses.name', 'DESC')->select('orders.*')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc total_declared_value', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=total_declared_value')
        ->assertOk();
    $this->assertEquals(
        Order::withSum('orderItems', 'declared_value_total')->orderBy('order_items_sum_declared_value_total', 'ASC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc total_declared_value', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=-total_declared_value')
        ->assertOk();
    $this->assertEquals(
        Order::withSum('orderItems', 'declared_value_total')->orderBy('order_items_sum_declared_value_total', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc grand_total', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=grand_total')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc grand_total', function () {
    $response = $this->getJson('/api/v2/salesman/orders?sort=-grand_total')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

test('orders are filterable by customer first name', function () {
    $user = $this->orders[0]->user;
    $this->getJson('/api/v2/salesman/orders?include=customer&filter[customer_name]=' . $user->first_name)
        ->assertOk()
        ->assertJsonCount($user->orders->count(), ['data'])
        ->assertJsonFragment([
            'email' => $user->email,
        ]);
});

test('orders are filterable by customer ID', function () {
    $user = $this->orders[0]->user;
    $this->getJson('/api/v2/salesman/orders?include=customer&filter[customer_id]=' . $user->id)
        ->assertOk()
        ->assertJsonCount($user->orders->count(), ['data'])
        ->assertJsonFragment([
            'email' => $user->email,
        ]);
});

it(
    'returns orders filtered after searching the order with order number, customer number and user Name',
    function (string $value) {
        $this->getJson('/api/v2/salesman/orders?include=orderStatusHistory&filter[search]=' . $value)
            ->assertOk()
            ->assertJsonFragment([
                'id' => $this->orders[0]->id,
            ]);
    }
)->with([
    fn () => $this->orders[0]->order_number,
    fn () => $this->orders[0]->user->customer_number,
    fn () => $this->orders[0]->user->first_name
]);

it('returns only orders with filtered payment status', function ($data) {
    $this->orders = Order::factory()->count(3)->state(new Sequence(
        ['id' => 100, 'payment_status' => OrderPaymentStatusEnum::PENDING, 'salesman_id' => $this->user->id],
        ['id' => 101, 'payment_status' => OrderPaymentStatusEnum::PAID, 'salesman_id' => $this->user->id],
        ['id' => 102, 'payment_status' => OrderPaymentStatusEnum::DUE, 'salesman_id' => $this->user->id],
    ))->create();

    $this->getJson('/api/v2/salesman/orders?filter[payment_status]=' . $data['payment_status'])
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

test('a salesman can place order for a user', function () {
    Event::fake();

    $customer = User::factory()->create();
    $customer->salesman()->associate($this->user)->save();

    $response = $this->postJson('/api/v2/salesman/orders', [
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
    $response->assertJsonPath('data.salesman.id', $this->user->id);
});
