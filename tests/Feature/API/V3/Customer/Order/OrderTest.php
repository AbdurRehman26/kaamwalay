<?php

use App\Models\CardProduct;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    Http::fake([
        // Faking AGS Certificate API
        'ags.api/*/certificates/*' => Http::response([]),
    ]);

    $this->user = User::factory()->create();
    $this->paymentPlan = PaymentPlan::factory()
        ->withPaymentPlanRanges()
        ->create(['max_protection_amount' => 300]);
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
