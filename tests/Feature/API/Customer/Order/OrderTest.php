<?php

use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => 1000000]);
    $this->cardProduct = CardProduct::factory()->create();
    $this->shippingMethod = ShippingMethod::factory()->create();
    $this->paymentMethod = PaymentMethod::factory()->create();
});

test('a customer can place order', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/customer/orders/', [
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

    $response->assertStatus(201);
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

    $response = $this->postJson('/api/customer/orders/');

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
    $response = $this->postJson('/api/customer/orders/');

    $response->assertUnauthorized();
});

test('a guest cannot see order', function () {
    Order::factory()->for($this->user)->create();

    $response = $this->getJson('/api/customer/orders/1');

    $response->assertUnauthorized();
});

test('a customer can see his order', function () {
    $this->actingAs($this->user);
    $order = Order::factory()->for($this->user)->create();
    OrderItem::factory()->for($order)->create();

    $response = $this->getJson('/api/customer/orders/' . $order->id);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => ['id', 'order_number', 'shipping_method'],
    ]);
});

test('a customer only see own orders', function () {
    Order::factory()->for(User::factory())
        ->has(OrderItem::factory())
        ->count(2)
        ->create([
            'order_status_id' => OrderStatus::STATUSES['placed'],
        ]);

    Order::factory()->for($this->user)
        ->has(OrderItem::factory())
        ->count(2)
        ->create([
            'order_status_id' => OrderStatus::STATUSES['placed'],
        ]);

    $this->actingAs($this->user);
    $response = $this->getJson('/api/customer/orders/');

    $response->assertOk();
    $response->assertJsonCount(2, ['data']);
});

test('a customer does not see payment pending orders', function () {
    Order::factory()->for($this->user)
        ->has(OrderItem::factory())
        ->count(2)
        ->state(new Sequence(
            [
                'order_status_id' => OrderStatus::STATUSES['placed'],
            ],
            [
                'order_status_id' => OrderStatus::STATUSES['payment_pending'],
            ],
        ))
        ->create();

    $this->actingAs($this->user);
    $response = $this->getJson('/api/customer/orders/');

    $response->assertOk();
    $response->assertJsonCount(1, ['data']);
});

test('a customer cannot see order by another customer', function () {
    $someOtherCustomer = User::factory()->create();
    $order = Order::factory()->for($someOtherCustomer)->create();

    $this->actingAs($this->user);
    $response = $this->getJson('/api/customer/orders/' . $order->id);

    $response->assertForbidden();
});

test('a guest cannot see orders', function () {
    $response = $this->getJson('/api/customer/orders/');

    $response->assertUnauthorized();
});

test('a customer can see invoice in order', function () {
    $this->actingAs($this->user);
    $order = Order::factory()->for($this->user)->create();
    OrderItem::factory()->for($order)->create();

    $response = $this->getJson('/api/customer/orders/' . $order->id);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => ['invoice' => ['path']],
    ]);
});

test('a customer can filter orders by order number', function () {
    $this->actingAs($this->user);

    $orders = Order::factory()
        ->count(2)
        ->for($this->user)
        ->state(new Sequence(
            [
                'order_number' => 'RG000000001',
                'order_status_id' => 2,
            ],
            [
                'order_number' => 'RG000000002',
                'order_status_id' => 2,
            ],
        ))
        ->create();

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

    $response = $this->getJson('/api/customer/orders?filter[order_number]=RG000000001');

    $response->assertOk();
    $response->assertJsonCount(1, ['data']);
    $response->assertJsonFragment([
        'order_number' => 'RG000000001',
    ]);
    $response->assertJsonMissing([
        'order_number' => 'RG000000002',
    ]);
});

test('an admin can complete review of an order', function () {
    $this->seed(RolesSeeder::class);

    $adminUser = User::createAdmin([
        'first_name' => $this->faker->firstName,
        'last_name' => $this->faker->lastName,
        'email' => $this->faker->safeEmail,
        'username' => $this->faker->userName,
        'password' => bcrypt('password'),
    ]);

    $this->actingAs($adminUser);

    $order = Order::factory()->for($this->user)->create();
    OrderItem::factory()->for($order)->create();

    $response = $this->postJson('/api/customer/orders/' . $order->id . '/complete-review');

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => ['reviewed_by', 'reviewed_at'],
    ]);
});

test('a customer can not complete review of an order', function () {
    $this->seed(RolesSeeder::class);

    $this->actingAs($this->user);

    $order = Order::factory()->for($this->user)->create();
    OrderItem::factory()->for($order)->create();

    $response = $this->postJson('/api/customer/orders/' . $order->id . '/complete-review');

    $response->assertStatus(403);
});
test('a customer cannot place order with item declared value greater than schema limit', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/customer/orders/', [
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
