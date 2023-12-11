<?php

use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\PaymentPlan;
use App\Models\PaymentPlanRange;
use App\Models\ShippingMethod;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    Http::fake([
        // Faking AGS Certificate API
        'ags.api/*/certificates/*' => Http::response([]),
    ]);

    config(['robograding.feature_order_shipping_insurance_fee_percentage' => 1]);

    $this->user = User::factory()->create();
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
});

test('a customer can place order', function () {
    $this->actingAs($this->user);
    Event::fake();

    $response = $this->postJson('/api/v3/customer/orders', [
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

test('a customer can place order with shipping insurance', function () {
    $this->actingAs($this->user);
    Event::fake();

    $response = $this->postJson('/api/v3/customer/orders', [
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

test('a customer can place order with signature at delivery required', function () {
    $this->actingAs($this->user);
    Event::fake();
    $signatureFee = 4.99;
    config('robograding.feature_order_signature_at_delivery_fee_value', $signatureFee);

    $response = $this->postJson('/api/v3/customer/orders', [
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
        'requires_signature' => true,
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
            'requires_signature',
            'signature_fee',
            'grand_total',
        ],
    ]);

    $response->assertJsonPath('data.signature_fee', $signatureFee);
    $response->assertJsonPath('data.requires_signature', true);
});

test('an order needs data', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/v3/customer/orders/');

    $response->assertJsonValidationErrors([
        'payment_plan' => 'The payment plan field is required.',
        'items' => 'The items field is required.',
        'shipping_address' => 'The shipping address field is required.',
        'billing_address' => 'The billing address field is required.',
        'shipping_method' => 'The shipping method field is required.',
    ]);
});

test('an order needs payment plan to be created', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/v3/customer/orders');

    $response->assertJsonValidationErrors([
        'payment_plan' => 'The payment plan field is required.',
    ]);
});

test('a guest cannot place order', function () {
    $response = $this->postJson('/api/v3/customer/orders/');

    $response->assertUnauthorized();
});

test('correct service level price is assigned according to price ranges', function (int $numberOfCards, $priceRangeIndex) {
    $this->actingAs($this->user);
    Event::fake();

    $response = $this->postJson('/api/v3/customer/orders', [
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
    ]);
    $response->assertSuccessful();
    $response->assertJsonPath('data.payment_plan.price', intval($this->paymentPlanRanges[$priceRangeIndex]->price));
})
    ->with([
        [11, 0],
        [21, 1],
        [61, 2],
        [121, 3],
        [211, 4],
    ]);

test('a customer can see his order', function () {
    $this->actingAs($this->user);
    $order = Order::factory()->for($this->user)->create();
    OrderItem::factory()->for($order)->create();

    $response = $this->getJson(route('v3.customer.orders.show', ['orderId' => $order->id, 'include[]' => 'shippingMethod']));

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => ['id', 'order_number', 'shipping_method'],
    ]);

    $response->assertJsonFragment([
        'refund_total' => 0,
        'extra_charge_total' => 0,
    ]);
});

test('a customer cannot see order by another customer', function () {
    $someOtherCustomer = User::factory()->create();
    $order = Order::factory()->for($someOtherCustomer)->create();

    $this->actingAs($this->user);
    $response = $this->getJson(route('v3.customer.orders.show', $order->id));

    $response->assertForbidden();
});

test('a customer only see own orders', function () {
    Event::fake();
    $user = User::factory();
    // Create orders for random user, this orders should not be returned in API response
    Order::factory()->for($user)
        ->has(OrderItem::factory())
        ->count(2)
        ->create(['order_status_id' => OrderStatus::PLACED]);

    // Create orders for correct user, these ones should be returned in API response
    Order::factory()->for($this->user)
        ->has(OrderItem::factory())
        ->count(3)
        ->create(['order_status_id' => OrderStatus::PLACED]);

    $this->actingAs($this->user);

    $response = $this->getJson(route('v3.customer.orders.index'));

    $response->assertOk();
    $response->assertJsonCount(3, ['data']);
});
