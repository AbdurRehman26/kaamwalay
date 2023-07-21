<?php

use App\Events\API\Order\V3\OrderShippingAddressChangedEvent;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);
    Event::fake();

    $this->user = User::factory()->withRole(config('permission.roles.salesman'))->create();

    $this->actingAs($this->user);
});

uses()->group('salesman', 'salesman_orders');

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
