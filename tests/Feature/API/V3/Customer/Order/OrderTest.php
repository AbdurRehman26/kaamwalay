<?php

use App\Models\CardProduct;
use App\Models\PaymentPlan;
use App\Models\PaymentPlanRange;
use App\Models\ShippingMethod;
use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Database\Eloquent\Factories\Sequence;

uses(WithFaker::class);

beforeEach(function () {
    Http::fake([
        // Faking AGS Certificate API
        'ags.api/*/certificates/*' => Http::response([]),
    ]);

    $this->user = User::factory()->create();
    $this->paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => 1000000, 'price' => 10]);
    $this->paymentPlanRanges = PaymentPlanRange::factory()->count(3)->state(new Sequence(
        ['payment_plan_id' => $this->paymentPlan->id, 'min_cards' => 1, 'max_cards' => 20],
        ['payment_plan_id' => $this->paymentPlan->id, 'min_cards' => 21, 'max_cards' => 50],
        ['payment_plan_id' => $this->paymentPlan->id, 'min_cards' => 51, 'max_cards' => 100],
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

test('correct service level price is assigned according to price ranges', function () {
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
                'quantity' => 21,
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
    $response->assertJsonPath('data.payment_plan.price', intval($this->paymentPlanRanges[1]->price));
});
