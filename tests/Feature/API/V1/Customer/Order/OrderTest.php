<?php

use App\Events\API\Order\OrderStatusChangedEvent;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Models\Wallet;
use App\Services\Admin\OrderStatusHistoryService;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;
use Symfony\Component\HttpFoundation\Response;

uses(WithFaker::class);

beforeEach(function () {
    Http::fake([
        // Faking AGS Certificate API
        'ags.api/*/certificates/*' => Http::response([]),
    ]);

    $this->user = User::factory()->create();
    $this->paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => 1000000]);
    $this->cardProduct = CardProduct::factory()->create();
    $this->shippingMethod = ShippingMethod::factory()->create();
    $this->paymentMethod = PaymentMethod::factory()->create();
    $this->orderStatusHistoryService = resolve(OrderStatusHistoryService::class);
});

test('a customer can place order', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/v1/customer/orders', [
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
        'shipping_method' => [
            'id' => $this->shippingMethod->id,
        ],
        'payment_method' => [
            'id' => $this->paymentMethod->id,
        ],
        'payment_provider_reference' => [
            'id' => '12345678',
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

test('an order needs data', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/v1/customer/orders/');

    $response->assertJsonValidationErrors([
        'payment_plan' => 'The payment plan field is required.',
        'items' => 'The items field is required.',
        'shipping_address' => 'The shipping address field is required.',
        'billing_address' => 'The billing address field is required.',
        'shipping_method' => 'The shipping method field is required.',
        'payment_method' => 'The payment method field is required.',
    ]);
});

test('a guest cannot place order', function () {
    $response = $this->postJson('/api/v1/customer/orders/');

    $response->assertUnauthorized();
});

test('a guest cannot see order', function () {
    Order::factory()->for($this->user)->create();

    $response = $this->getJson('/api/v1/customer/orders/1');

    $response->assertUnauthorized();
});

test('a customer can see his order', function () {
    $this->actingAs($this->user);
    $order = Order::factory()->for($this->user)->create();
    OrderItem::factory()->for($order)->create();

    $response = $this->getJson('/api/v1/customer/orders/' . $order->id);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => ['id', 'order_number', 'shipping_method'],
    ]);

    $response->assertJsonFragment([
        'refund_total' => 0,
        'extra_charge_total' => 0,
    ]);
});

test('a customer only see own orders', function () {
    Event::fake([
        OrderStatusChangedEvent::class,
    ]);
    $user = User::factory();
    $orders = Order::factory()->for($user)
        ->has(OrderItem::factory())
        ->count(2)
        ->create();

    $orders = $orders->merge(
        Order::factory()->for($this->user)
            ->has(OrderItem::factory())
            ->count(2)
            ->create()
    );

    $this->actingAs($this->user);
    $orders->each(function ($order) {
        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::PLACED, $order->id, $order->user_id);
    });

    $response = $this->getJson('/api/v1/customer/orders');

    $response->assertOk();
    $response->assertJsonCount(2, ['data']);
});

test('a customer does not see payment pending orders', function () {
    Event::fake([
        OrderStatusChangedEvent::class,
    ]);
    $orders = Order::factory()->for($this->user)
        ->has(OrderItem::factory())
        ->count(2)
        ->state(new Sequence(
            ['order_status_id' => OrderStatus::PLACED],
            ['order_status_id' => OrderStatus::PAYMENT_PENDING],
        ))
        ->create();

    $orders->each(function ($order) {
        $this->orderStatusHistoryService->addStatusToOrder($order->order_status_id, $order->id, $order->user_id);
    });

    $this->actingAs($this->user);
    $response = $this->getJson('/api/v1/customer/orders');

    $response->assertOk();
    $response->assertJsonCount(1, ['data']);
});

test('a customer cannot see order by another customer', function () {
    $someOtherCustomer = User::factory()->create();
    $order = Order::factory()->for($someOtherCustomer)->create();

    $this->actingAs($this->user);
    $response = $this->getJson('/api/v1/customer/orders/' . $order->id);

    $response->assertForbidden();
});

test('a guest cannot see orders', function () {
    $response = $this->getJson('/api/v1/customer/orders/');

    $response->assertUnauthorized();
});

test('a customer can see invoice in order', function () {
    $this->actingAs($this->user);
    $order = Order::factory()->for($this->user)->create();
    OrderItem::factory()->for($order)->create();

    $response = $this->getJson('/api/v1/customer/orders/' . $order->id);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => ['invoice' => ['path']],
    ]);
});

test('a customer can filter orders by order number', function () {
    Event::fake([
        OrderStatusChangedEvent::class,
    ]);
    $this->actingAs($this->user);

    $orders = Order::factory()
        ->count(2)
        ->for($this->user)
        ->state(new Sequence(
            [
                'order_number' => 'RG000000001',
            ],
            [
                'order_number' => 'RG000000002',
            ],
        ))
        ->create();

    $orders->each(function ($order) {
        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::PLACED, $order->id, $this->user->id);
    });

    OrderItem::factory()->count(2)
        ->state(new Sequence(
            [
                'order_id' => $orders[0]->id,
            ],
            [
                'order_id' => $orders[1]->id,
            ]
        ))
        ->create();

    $response = $this->getJson('/api/v1/customer/orders?filter[order_number]=RG000000001');

    $response->assertOk();
    $response->assertJsonCount(1, ['data']);
    $response->assertJsonFragment([
        'order_number' => 'RG000000001',
    ]);
    $response->assertJsonMissing([
        'order_number' => 'RG000000002',
    ]);
});

test('a customer can not complete review of an order', function () {
    $this->seed(RolesSeeder::class);

    $this->actingAs($this->user);

    $order = Order::factory()->for($this->user)->create();
    OrderItem::factory()->for($order)->create();

    $response = $this->postJson('/api/v1/admin/orders/' . $order->id . '/status-history', [
        'order_status_id' => OrderStatus::CONFIRMED,
    ]);

    $response->assertStatus(403);
});

test('a customer cannot place order with item declared value greater than schema limit', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/v1/customer/orders/', [
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
        'items' => [
            [
                'card_product' => [
                    'id' => $this->cardProduct->id,
                ],
                'quantity' => 100,
                'declared_value_per_unit' => 1000000,
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
        'shipping_method' => [
            'id' => $this->shippingMethod->id,
        ],
        'payment_method' => [
            'id' => $this->paymentMethod->id,
        ],
        'payment_provider_reference' => [
            'id' => '12345678',
        ],
    ]);

    $response->assertStatus(400);
    $response->assertJsonStructure(['data' => 'error']);
});

it('can calculate collector coin price for an order', function () {
    config([
        'robograding.web3.supported_networks' => '97',
    ]);

    config([
        'web3networks' => [
            97 => [
                'chain_id' => '0x61',
                'chain_name' => 'Binance Smart Chain - Testnet',
                'native_currency' => [
                    'name' => 'tBnb',
                    'symbol' => 'tBNB',
                    'decimals' => 18,
                ],
                'rpc_urls' => ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                'block_explorer_urls' => ['https://testnet.bscscan.com'],
                'is_testnet' => true,
                'collector_coin_token' => '0xb1f5a876724dcfd6408b7647e41fd739f74ec039',
                'collector_coin_wallet' => env('TEST_WALLET'),
            ],
        ],
        ]);

    $this->actingAs($this->user);
    $order = Order::factory()->for($this->user)->create();
    $paymentMethod = PaymentMethod::factory()->create([
        'code' => 'collector_coin',
    ]);
    OrderItem::factory()->for($order)->create();
    OrderPayment::factory()->for($order)->for($paymentMethod)->create();

    $response = $this->getJson('/api/v1/customer/orders/' . $order->id . '/collector-coin?payment_blockchain_network=97');

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'value',
    ]);
});

it('throws error if using unsupported network', function () {
    config([
        'robograding.web3.supported_networks' => '97',
    ]);

    $this->actingAs($this->user);
    $order = Order::factory()->for($this->user)->create();
    $paymentMethod = PaymentMethod::factory()->create([
        'code' => 'collector_coin',
    ]);
    OrderItem::factory()->for($order)->create();
    OrderPayment::factory()->for($order)->for($paymentMethod)->create();
    
    $response = $this->getJson('/api/v1/customer/orders/' . $order->id . '/collector-coin?payment_blockchain_network=1');

    $response->assertStatus(400);
    $response->assertJsonStructure([
        'error', 'value',
    ]);

    $response->assertJsonFragment([
        'error' => 'This payment blockchain network is not supported.',
        'value' => 0.0,
    ]);
});

test('a customer can not pay from wallet if wallet has insufficient balance', function () {
    $this->actingAs($this->user);

    $this->postJson('/api/v1/customer/orders', [
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
        'shipping_method' => [
            'id' => $this->shippingMethod->id,
        ],
        'payment_method' => [
            'id' => $this->paymentMethod->id,
        ],
        'payment_provider_reference' => [
            'id' => '12345678',
        ],
        'payment_by_wallet' => 10,
    ])->assertStatus(Response::HTTP_BAD_REQUEST);
});

test('a customer can place order with partial amount from wallet', function () {
    $this->actingAs($this->user);
    Wallet::factory()->create([
        'user_id' => $this->user->id,
        'balance' => 50,
    ]);
    $walletPayment = (float) 10;
    $this->postJson('/api/v1/customer/orders', [
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
        'shipping_method' => [
            'id' => $this->shippingMethod->id,
        ],
        'payment_method' => [
            'id' => $this->paymentMethod->id,
        ],
        'payment_provider_reference' => [
            'id' => '12345678',
        ],
        'payment_by_wallet' => $walletPayment,
    ])
        ->assertSuccessful()
        ->assertJsonStructure([
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

    $order = Order::first();

    expect($order->lastOrderPayment->amount)->toBe($walletPayment);
});

test('a customer can not place order with partial amount from wallet without payment method', function () {
    $this->actingAs($this->user);
    Wallet::factory()->create([
        'user_id' => $this->user->id,
        'balance' => 50,
    ]);
    $walletPayment = (float) 10;
    $this->postJson('/api/v1/customer/orders', [
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
        'shipping_method' => [
            'id' => $this->shippingMethod->id,
        ],
        'payment_method' => null,
        'payment_by_wallet' => $walletPayment,
    ])
        ->assertStatus(400)
        ->assertJsonStructure(['data' => 'error']);
});
