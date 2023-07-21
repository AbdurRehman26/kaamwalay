<?php

use App\Events\API\Order\V3\OrderShippingAddressChangedEvent;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\PaymentPlan;
use App\Models\Salesman;
use App\Models\ShippingMethod;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);
    Event::fake();

    config(['robograding.feature_order_insurance_shipping_fee_percentage' => 1]);

    $this->user = User::factory()->withRole(config('permission.roles.salesman'))->create();
    Salesman::create(['user_id' => $this->user->id, 'commission_type' => 0, 'commission_value' => 10]);

    $this->actingAs($this->user);
});

uses()->group('salesman', 'salesman_orders');

test('a salesman can place order for a user with shipping insurance', function () {
    Event::fake();


    $paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => 1000000, 'price' => 10]);
    $cardProduct = CardProduct::factory()->create();
    $shippingMethod = ShippingMethod::factory()->insured()->create();

    $customer = User::factory()->create();
    $customer->salesman()->associate($this->user)->save();

    $response = $this->postJson('/api/v3/salesman/orders', [
        'user_id' => $customer->id,
        'payment_plan' => [
            'id' => $paymentPlan->id,
        ],
        'items' => [
            [
                'card_product' => [
                    'id' => $cardProduct->id,
                ],
                'quantity' => 1,
                'declared_value_per_unit' => 500,
            ],
            [
                'card_product' => [
                    'id' => $cardProduct->id,
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
            'id' => $shippingMethod->id,
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
            'user',
            'created_by',
        ],
    ]);

    $response->assertJsonPath('data.shipping_insurance_fee', 10);
});

test('a salesman can update order shipping address', function () {
    $order = Order::factory()->create([
        'salesman_id' => $this->user->id,
    ]);

    $this->actingAs($this->user);

    $this->putJson(route('v3.salesman.orders.update-shipping-address', ['order' => $order]), [
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
    $orderAddress = OrderAddress::factory()->create();
    $order = Order::factory()->create([
        'salesman_id' => $this->user->id,
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
    $this->putJson(route('v3.salesman.orders.update-shipping-address', ['order' => $order]), $addressData)
        ->assertOk();

    $order = $order->fresh();
    $this->assertEquals($order->shipping_order_address_id, $order->billing_order_address_id);
    $this->assertEquals($order->shippingAddress->address, $addressData['address']);

    Event::assertDispatched(OrderShippingAddressChangedEvent::class);
});

test('if shipping and billing addresses are different only shipping address is updated ', function () {
    $orderAddress = OrderAddress::factory()->create();
    $order = Order::factory()->create([
        'salesman_id' => $this->user->id,
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
    $this->putJson(route('v3.salesman.orders.update-shipping-address', ['order' => $order]), $addressData)
        ->assertOk();

    $order = $order->fresh();
    $this->assertNotEquals($order->shipping_order_address_id, $order->billing_order_address_id);
    $this->assertEquals($order->shippingAddress->address, $addressData['address']);

    Event::assertDispatched(OrderShippingAddressChangedEvent::class);
});

test('a salesman can not update order shipping address if they don\'t own the order', function () {
    $newUser = User::factory()->withRole(config('permission.roles.salesman'))->create();

    $order = Order::factory()->create([
        'salesman_id' => $newUser->id,
    ]);

    $this->actingAs($this->user);

    $this->putJson(route('v3.salesman.orders.update-shipping-address', ['order' => $order]), [
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
        ->assertForbidden();
});
