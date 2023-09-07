<?php

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Events\API\Order\V3\OrderShippingAddressChangedEvent;
use App\Exceptions\API\Admin\IncorrectOrderStatus;
use App\Jobs\Admin\Order\CreateOrderFoldersOnAGSLocalMachine;
use App\Jobs\Admin\Order\CreateOrderFoldersOnDropbox;
use App\Jobs\Admin\Order\GetCardGradesFromAgs;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\PaymentPlanRange;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Models\UserCard;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
        CardSeriesSeeder::class,
        CardSetsSeeder::class,
        CardProductSeeder::class,
    ]);

    config(['robograding.feature_order_shipping_insurance_fee_percentage' => 1]);

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

    $orderItems = OrderItem::factory()->count(10)
        ->state(new Sequence(
            [
                'order_id' => $this->orders[0]->id,
            ],
            [
                'order_id' => $this->orders[1]->id,
            ],
            [
                'order_id' => $this->orders[1]->id,
            ],
            [
                'order_id' => $this->orders[1]->id,
            ],
            [
                'order_id' => $this->orders[1]->id,
            ],
            [
                'order_id' => $this->orders[1]->id,
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

    UserCard::factory()->count(7)
        ->state(new Sequence(
            [
                'order_item_id' => $orderItems[0]->id,
                'certificate_number' => '000000100',
            ],
            [
                'order_item_id' => $orderItems[1]->id,
                'certificate_number' => '09000000',
            ],
            [
                'order_item_id' => $orderItems[2]->id,
                'certificate_number' => '09000001',
            ],
            [
                'order_item_id' => $orderItems[3]->id,
                'certificate_number' => '09000002',
            ],
            [
                'order_item_id' => $orderItems[4]->id,
                'certificate_number' => '09000003',
            ],
            [
                'order_item_id' => $orderItems[5]->id,
                'certificate_number' => '09000004',
            ],
            [
                'order_item_id' => $orderItems[6]->id,
                'certificate_number' => '09000005',
            ]
        ))->create();

    $this->paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => 1000000, 'price' => 10]);
    $this->paymentPlanRanges = PaymentPlanRange::factory()->count(5)->state(new Sequence(
        ['payment_plan_id' => $this->paymentPlan->id, 'min_cards' => 1, 'max_cards' => 20],
        ['payment_plan_id' => $this->paymentPlan->id, 'min_cards' => 21, 'max_cards' => 50],
        ['payment_plan_id' => $this->paymentPlan->id, 'min_cards' => 51, 'max_cards' => 100],
        ['payment_plan_id' => $this->paymentPlan->id, 'min_cards' => 101, 'max_cards' => 200],
        ['payment_plan_id' => $this->paymentPlan->id, 'min_cards' => 201, 'max_cards' => null],
    ))->create();
    $this->cardProduct = CardProduct::factory()->create();
    $this->shippingMethod = ShippingMethod::factory()->insured()->create();
    $this->paymentMethod = PaymentMethod::factory()->create(['code' => 'manual']);

    $this->sampleAgsResponse = json_decode(file_get_contents(
        base_path().'/tests/stubs/AGS_card_grades_collection_200.json'
    ), associative: true);

    $this->actingAs($this->user);

    $this->orders->first()->attachTags(['abandoned']);
});

uses()->group('admin', 'admin_orders');

it('returns orders list for admin', function () {
    $this->getJson(route('v3.admin.orders.index'))
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
    $this->getJson(route('v3.admin.orders.show', ['order' => $this->orders[0]->id, 'include' => 'customer,orderItems']))
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
        ->getJson(route('v3.admin.orders.index'))
        ->assertForbidden();
});

test('order details throws error for roles other than admin', function () {
    $this->actingAs(User::factory()->withRole(config('permission.roles.customer'))->create())
        ->getJson(route('v3.admin.orders.show', ['order' => 1]))
        ->assertForbidden();
});

it('filters orders by id', function () {
    $this->getJson(route('v3.admin.orders.index', ['filter[order_id]' => $this->orders[0]->id]))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'id' => $this->orders[0]->id,
        ]);
});

it('returns only placed orders', function () {
    $this->getJson(route('v3.admin.orders.index', ['include' => 'orderStatusHistory', 'filter[status]' => 'placed']))
        ->assertOk()
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::PLACED,
        ]);
});

it('returns only reviewed orders', function () {
    $this->getJson(route('v3.admin.orders.index', ['include' => 'orderStatusHistory', 'filter[status]' => 'confirmed']))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::CONFIRMED,
        ]);
});

it('returns only graded orders', function () {
    $this->getJson(route('v3.admin.orders.index', ['include' => 'orderStatusHistory', 'filter[status]' => 'graded']))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::GRADED,
        ]);
});

it('returns only shipped orders', function () {
    $this->getJson(route('v3.admin.orders.index', ['include' => 'orderStatusHistory', 'filter[status]' => 'shipped']))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::SHIPPED,
        ]);
});

it('returns orders order by asc order_number', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => 'order_number']))
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('order_number')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc order_number', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => '-order_number']))
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('order_number', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc created_at', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => 'created_at']))
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('created_at')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc created_at', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => '-created_at']))
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('created_at', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc arrived_at', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => 'arrived_at']))
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('arrived_at')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc arrived_at', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => '-arrived_at']))
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('arrived_at', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc customer_number', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => 'customer_number']))
        ->assertOk();
    $this->assertEquals(
        Order::join('users', 'users.id', 'orders.user_id')->orderBy('users.customer_number', 'ASC')->select('orders.*')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc customer_number', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => '-customer_number']))
        ->assertOk();
    $this->assertEquals(
        Order::join('users', 'users.id', 'orders.user_id')->orderBy('users.customer_number', 'DESC')->select('orders.*')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc cards number', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => 'cards']))
        ->assertOk();
    $this->assertEquals(
        Order::withSum('orderItems', 'quantity')->orderBy('order_items_sum_quantity', 'ASC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc cards number', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => '-cards']))
        ->assertOk();
    $this->assertEquals(
        Order::withSum('orderItems', 'quantity')->orderBy('order_items_sum_quantity', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc status', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => 'status']))
        ->assertOk();
    $this->assertEquals(
        Order::join('order_statuses', 'order_statuses.id', 'orders.order_status_id')->orderBy('order_statuses.name', 'ASC')->select('orders.*')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc status', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => '-status']))
        ->assertOk();
    $this->assertEquals(
        Order::join('order_statuses', 'order_statuses.id', 'orders.order_status_id')->orderBy('order_statuses.name', 'DESC')->select('orders.*')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc total_declared_value', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => 'total_declared_value']))
        ->assertOk();
    $this->assertEquals(
        Order::withSum('orderItems', 'declared_value_total')->orderBy('order_items_sum_declared_value_total', 'ASC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc total_declared_value', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => '-total_declared_value']))
        ->assertOk();
    $this->assertEquals(
        Order::withSum('orderItems', 'declared_value_total')->orderBy('order_items_sum_declared_value_total', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by asc grand_total', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => 'grand_total']))
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns orders order by desc grand_total', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['sort' => '-grand_total']))
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

test('orders are filterable by customer first name', function () {
    $user = $this->orders[0]->user;
    $this->getJson(route('v3.admin.orders.index', ['include' => 'customer', 'filter[customer_name]' => $user->first_name]))
        ->assertOk()
        ->assertJsonCount($user->orders->count(), ['data'])
        ->assertJsonFragment([
            'email' => $user->email,
        ]);
});

test('orders are filterable by customer ID', function () {
    $user = $this->orders[0]->user;
    $this->getJson(route('v3.admin.orders.index', ['include' => 'customer', 'filter[customer_id]' => $user->id]))
        ->assertOk()
        ->assertJsonCount($user->orders->count(), ['data'])
        ->assertJsonFragment([
            'email' => $user->email,
        ]);
});

test('an admin can get order cards grades', function () {
    Bus::fake();

    $this->getJson(route('v3.admin.orders.get-grades', ['order' => $this->orders[1]->id, 'include' => 'cardProduct.cardSet.cardSeries,cardProduct.cardCategory,userCard.customer']))
        ->assertOk();

    Bus::assertDispatched(GetCardGradesFromAgs::class);
});

test('a customer can not get order cards grades', function () {
    $customerUser = User::factory()->withRole(config('permission.roles.customer'))->create();

    $this->actingAs($customerUser);

    $this->getJson(route('v3.admin.orders.get-grades', ['order' => $this->orders[1]->id]))
        ->assertForbidden();
});

it('can not get order grades if order is not reviewed', function () {
    $response = $this->getJson(route('v3.admin.orders.get-grades', ['order' => $this->orders[0]->id]));
    $response->assertJsonStructure(['error']);
    $response->assertJsonPath('error', (new IncorrectOrderStatus)->getMessage());
});

test('it dispatches get grades from AGS job when admin fetches grades', function () {
    Bus::fake();

    UserCard::factory()->create([
        'order_item_id' => $this->orders[1]->orderItems->first()->id,
    ]);
    $this->getJson(route('v3.admin.orders.get-grades', ['order' => $this->orders[1]->id, 'include' => 'cardProduct.cardSet.cardSeries,cardProduct.cardCategory,userCard.customer']))
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
    $this->getJson(route('v3.admin.orders.get-grades', ['order' => $this->orders[1]->id, 'include' => 'cardProduct.cardSet.cardSeries,cardProduct.cardCategory,userCard.customer']))
        ->assertJsonFragment([
            'center' => '2.00',
        ])
        ->assertJsonFragment([
            'id' => $orderItemId,
        ]);
});

it(
    'returns orders filtered after searching the order with order number, customer number and user Name',
    function (string $value) {
        $this->getJson(route('v3.admin.orders.index', ['include' => 'orderStatusHistory', 'filter[search]' => $value]))
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

it('returns only orders with filtered payment status', function ($data) {
    $this->orders = Order::factory()->count(3)->state(new Sequence(
        ['id' => 100, 'payment_status' => OrderPaymentStatusEnum::PENDING],
        ['id' => 101, 'payment_status' => OrderPaymentStatusEnum::PAID],
        ['id' => 102, 'payment_status' => OrderPaymentStatusEnum::DUE],
    ))->create();

    $this->getJson(route('v3.admin.orders.index', ['filter[payment_status]' => $data['payment_status']]))
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

test('an admin can place order for an user', function () {
    Event::fake();

    $customer = User::factory()->create();

    $response = $this->postJson('/api/v3/admin/orders', [
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
        ], [
            'order_id' => $this->orders[1]->id,
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

    $response = $this->postJson('/api/v3/admin/orders', [
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

test('an admin can place order for a user with shipping insurance', function () {
    Event::fake();

    $customer = User::factory()->create();

    $response = $this->postJson('/api/v3/admin/orders', [
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
        'requires_shipping_insurance' => true,
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
            'requires_shipping_insurance',
            'shipping_insurance_fee',
            'grand_total',
        ],
    ]);
    $response->assertJsonPath('data.shipping_insurance_fee', 10);
    $response->assertJsonPath('data.requires_shipping_insurance', true);
});

test('correct service level price is assigned according to price ranges', function (int $numberOfCards, $priceRangeIndex) {
    Event::fake();

    $customer = User::factory()->create();

    $response = $this->postJson('/api/v3/admin/orders', [
        'user_id' => $customer->id,
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
        'items' => [
            [
                'card_product' => [
                    'id' => $this->cardProduct->id,
                ],
                'quantity' => $numberOfCards,
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
    $response->assertJsonPath('data.payment_plan.price', intval($this->paymentPlanRanges[$priceRangeIndex]->price));
})
    ->with([
        [11, 0],
        [21, 1],
        [61, 2],
        [121, 3],
        [211, 4],
    ]);

test('an admin can update order shipping address', function () {
    Event::fake();
    $order = Order::factory()->create();

    $this->actingAs($this->user);

    $this->putJson(route('v3.admin.orders.update-shipping-address', ['order' => $order]), [
        'country_code' => 'US',
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'address' => $this->faker->address(),
        'address_2' => $this->faker->address(),
        'city' => $this->faker->city(),
        'state' => $this->faker->stateAbbr(),
        'zip' => $this->faker->postcode(),
        'phone' => $this->faker->phoneNumber(),
    ])
        ->assertOk();

    Event::assertDispatched(OrderShippingAddressChangedEvent::class);
});

test('if shipping and billing addresses are equal both get updated on update of shipping address ', function () {
    Event::fake();

    $orderAddress = OrderAddress::factory()->create();
    $order = Order::factory()->create([
        'shipping_order_address_id' => $orderAddress->id,
        'billing_order_address_id' => $orderAddress->id,
    ]);

    $this->actingAs($this->user);

    $addressData = [
        'country_code' => 'US',
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'address' => $this->faker->address(),
        'address_2' => $this->faker->address(),
        'city' => $this->faker->city(),
        'state' => $this->faker->stateAbbr(),
        'zip' => $this->faker->postcode(),
        'phone' => $this->faker->phoneNumber(),
    ];
    $this->putJson(route('v3.admin.orders.update-shipping-address', ['order' => $order]), $addressData)
        ->assertOk();

    $order = $order->fresh();
    $this->assertEquals($order->shipping_order_address_id, $order->billing_order_address_id);
    $this->assertEquals($order->shippingAddress->address, $addressData['address']);

    Event::assertDispatched(OrderShippingAddressChangedEvent::class);
});

test('if shipping and billing addresses are different only shipping address is updated ', function () {
    Event::fake();

    $orderAddress = OrderAddress::factory()->create();
    $order = Order::factory()->create([
        'shipping_order_address_id' => $orderAddress->id,
    ]);

    $this->actingAs($this->user);

    $addressData = [
        'country_code' => 'US',
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'address' => $this->faker->address(),
        'address_2' => $this->faker->address(),
        'city' => $this->faker->city(),
        'state' => $this->faker->stateAbbr(),
        'zip' => $this->faker->postcode(),
        'phone' => $this->faker->phoneNumber(),
    ];
    $this->putJson(route('v3.admin.orders.update-shipping-address', ['order' => $order]), $addressData)
        ->assertOk();

    $order = $order->fresh();
    $this->assertNotEquals($order->shipping_order_address_id, $order->billing_order_address_id);
    $this->assertEquals($order->shippingAddress->address, $addressData['address']);

    Event::assertDispatched(OrderShippingAddressChangedEvent::class);
});

test('an admin can get paginated cards for grading', function () {
    Http::fake(['*' => Http::response($this->sampleAgsResponse)]);
    $orderItemId = $this->orders[1]->orderItems->first()->id;

    $this->getJson(route('v3.admin.orders.get-grades', ['order' => $this->orders[1]->id, 'include[]' => 'userCard']))
        ->assertJsonStructure([
            'data',
            'links',
            'meta',
        ])
        ->assertJsonFragment([
            'center' => '2.00',
        ])
        ->assertJsonFragment([
            'id' => $orderItemId,
        ]);
});

test('an admin can paginate through cards results', function () {
    Http::fake(['*' => Http::response($this->sampleAgsResponse)]);
    $orderItemId = $this->orders[1]->orderItems[2]->id;

    $this->getJson(route('v3.admin.orders.get-grades', ['order' => $this->orders[1]->id, 'per_page' => 2, 'page' => 2, 'include[]' => 'userCard']))
        ->assertJsonFragment([
            'id' => $orderItemId,
        ]);
});

test('an admin can change the amount of cards results per page', function () {
    Http::fake(['*' => Http::response($this->sampleAgsResponse)]);

    $this->getJson(route('v3.admin.orders.get-grades', ['order' => $this->orders[1]->id, 'per_page' => 3]))
        ->assertJsonCount(3, ['data']);
});

test('an admin can filter by item to revise', function () {
    Http::fake(['*' => Http::response($this->sampleAgsResponse)]);
    $orderItemId = $this->orders[1]->orderItems[2]->id;

    $this->getJson(route('v3.admin.orders.get-grades', ['order' => $this->orders[1]->id, 'filter[id]' => $orderItemId, 'include[]' => 'userCard']))
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'id' => $orderItemId,
        ]);
});

it('filters orders with abandoned tag', function () {
    $this->getJson(route('v3.admin.orders.index', ['filter[tags]' => 'abandoned']))
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'id' => $this->orders->first()->id,
        ]);
});

it('filters orders without any tags orders', function () {
    $response = $this->getJson(route('v3.admin.orders.index', ['filter[tags]' => -1]))
        ->assertOk()
        ->assertJsonCount(4, ['data']);

    $this->assertEquals(
        Order::doesntHave('tags')->orderBy('id')->pluck('id')->toArray(),
        collect($response->getData()->data)->sortBy('id')->pluck('id')->toArray()
    );
});

test('an admin can create folders manually', function () {
    Bus::fake();

    $order = Order::factory()->create();

    $this->postJson(route('v3.admin.orders.create-folders', ['order' => $order]))
        ->assertSuccessful();

    Bus::assertDispatchedTimes(CreateOrderFoldersOnDropbox::class);
    Bus::assertDispatchedTimes(CreateOrderFoldersOnAGSLocalMachine::class);
});
