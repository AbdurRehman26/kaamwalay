<?php

use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Models\Wallet;
use App\Services\Admin\V2\OrderStatusHistoryService;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\WithFaker;

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

test('a customer can create an order', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/v2/customer/orders', [
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
    ]);
    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'id',
            'order_number',
            'payment_plan',
        ],
    ]);
});

test('an order needs payment plan to be created', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/v2/customer/orders');

    $response->assertJsonValidationErrors([
        'payment_plan' => 'The payment plan field is required.',
    ]);
});


test('a customer can update order addresses', function () {
    $this->actingAs($this->user);

    $response = $this->postJson(route('v2.customer.orders.store'), [
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
    ]);

    $orderItem = OrderItem::factory()->state(new Sequence(
        [
            'order_id' => $response['data']['id'],
        ]
    ))->create();

    $response = $this->postJson(route('v2.customer.orders.update-addresses', [
        'order' => $response['data']['id'],
    ]), [
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
        'items' => [
            [
                'card_product' => [
                    'id' => $orderItem['card_product_id'],
                ],
                'quantity' => $orderItem['quantity'],
                'declared_value_per_unit' => (int) $orderItem['declared_value_per_unit'],
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
        'customer_address' => [
            'id' => null,
        ],
        'shipping_method' => [
            'id' => $this->shippingMethod->id,
        ],
    ]);
    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'id',
            'order_number',
            'payment_plan',
            'shipping_method',
            'shipping_address',
            'order_items',
            'payment_plan',
            'order_step',
        ],
    ]);
});

test('a customer can not update order addresses without addresses', function () {
    $this->actingAs($this->user);

    $response = $this->postJson(route('v2.customer.orders.store'), [
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
    ]);

    $response = $this->postJson(route('v2.customer.orders.update-addresses', [
        'order' => $response['data']['id'],
    ]), [
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
    ]);

    $response->assertJsonValidationErrors([
        'customer_address' => 'The customer address field is required.',
        'shipping_address' => 'The shipping address field is required.',
        'shipping_method' => 'The shipping method field is required.',
        'items' => 'Please select at least one card to proceed.',
    ]);
});

test('a customer can complete his order including wallet payment', function () {
    $this->actingAs($this->user);

    Wallet::factory()->create([
        'user_id' => $this->user->id,
        'balance' => 50,
    ]);
    $walletPayment = (float) 10;

    $response = $this->postJson(route('v2.customer.orders.store'), [
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
    ]);

    $orderItem = OrderItem::factory()->state(new Sequence(
        [
            'order_id' => $response['data']['id'],
        ]
    ))->create();
    $response = $this->postJson(route('v2.customer.orders.update-addresses', [
        'order' => $response['data']['id'],
    ]), [
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
        'items' => [
            [
                'card_product' => [
                    'id' => $orderItem['card_product_id'],
                ],
                'quantity' => $orderItem['quantity'],
                'declared_value_per_unit' => (int) $orderItem['declared_value_per_unit'],
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
        'customer_address' => [
            'id' => null,
        ],
        'shipping_method' => [
            'id' => $this->shippingMethod->id,
        ],
    ]);

    $this->postJson(route('v2.customer.orders.complete', [
        'order' => $response['data']['id'],
    ]), [
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
        'items' => [
            [
                'card_product' => [
                    'id' => $orderItem['card_product_id'],
                ],
                'quantity' => $orderItem['quantity'],
                'declared_value_per_unit' => (int) $orderItem['declared_value_per_unit'],
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
            'id' => 1,
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
