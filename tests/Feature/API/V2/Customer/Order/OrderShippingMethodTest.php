<?php

use App\Models\CardProduct;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Services\Admin\V2\OrderStatusHistoryService;
use Illuminate\Foundation\Testing\WithFaker;

use function Pest\Laravel\putJson;

uses(WithFaker::class);

beforeEach(function () {
    Http::fake([
        // Faking AGS Certificate API
        'ags.api/*/certificates/*' => Http::response([]),
    ]);

    $this->user = User::factory()->create();
    $this->paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => 1000000, 'price' => 10]);
    $this->cardProduct = CardProduct::factory()->create();
    $this->insuredShippingMethod = ShippingMethod::factory()->insured()->create();
    $this->vaultShippingMethod = ShippingMethod::factory()->vault()->create();
    $this->paymentMethod = PaymentMethod::factory()->create();
    $this->insuredShippingOrderStatusHistoryService = resolve(OrderStatusHistoryService::class);
    $this->actingAs($this->user);
    $this->insuredShippingOrder = Order::factory()->for($this->user)->create([
        'shipping_method_id' => $this->insuredShippingMethod->id,
        'service_fee' => 20,
        'shipping_fee' => 14,
        'grand_total' => 34,
    ]);
    $this->vaultShippingOrder = Order::factory()->for($this->user)->create([
        'shipping_method_id' => $this->vaultShippingMethod->id,
        'service_fee' => 20,
        'shipping_fee' => 0,
    ]);
    OrderItem::factory()->for($this->insuredShippingOrder)->create();
});

test('order\'s shipping method can be changed from insured shipping to vault', function () {
    putJson(route('v2.customer.orders.update-shipping-method', ['order' => $this->insuredShippingOrder]), [
        'shipping_method_id' => $this->vaultShippingMethod->id,
    ])->assertOk();
    expect($this->insuredShippingOrder->refresh()->shippingMethod->code)->toBe(ShippingMethod::VAULT_STORAGE);
});


test('order\'s shipping method can be changed from vault to insured shipping', function () {
    OrderItem::factory()->for($this->vaultShippingOrder)->create();
    putJson(route('v2.customer.orders.update-shipping-method', ['order' => $this->vaultShippingOrder]), [
        'shipping_method_id' => $this->insuredShippingMethod->id,
        'customer_address' => ['id' => CustomerAddress::factory()->for($this->user)->create()->id],
    ])->assertOk();
    expect($this->vaultShippingOrder->refresh()->shippingMethod->code)->toBe(ShippingMethod::INSURED_SHIPPING);
});

test('when order shipping method is changed from insured to vault, shipping fee is calculated as 0', function () {
    putJson(route('v2.customer.orders.update-shipping-method', ['order' => $this->insuredShippingOrder]), [
        'shipping_method_id' => $this->vaultShippingMethod->id,
    ])->assertOk();

    expect($this->insuredShippingOrder->refresh()->shipping_fee)->toBe(0.0);
});

test('when order shipping method is changed from vault to insured, shipping fee is calculated', function () {
    OrderItem::factory()->for($this->vaultShippingOrder)->create([
        'declared_value_total' => 100,
        'quantity' => 2,
    ]);

    putJson(route('v2.customer.orders.update-shipping-method', ['order' => $this->vaultShippingOrder]), [
        'shipping_method_id' => $this->insuredShippingMethod->id,
        'customer_address' => ['id' => CustomerAddress::factory()->for($this->user)->create()->id],
    ])->assertOk();

    expect($this->vaultShippingOrder->refresh()->shipping_fee)->toBe(14.0);
});

test('shipping method can not be changed for paid order', function () {
    $order = Order::factory()->for($this->user)->create([
        'shipping_method_id' => $this->vaultShippingMethod->id,
        'shipping_fee' => 0,
        'payment_status' => 2,
    ]);

    OrderItem::factory()->for($order)->create([
        'declared_value_total' => 100,
        'quantity' => 2,
    ]);

    putJson(route('v2.customer.orders.update-shipping-method', ['order' => $order]), [
        'shipping_method_id' => $this->insuredShippingMethod->id,
        'customer_address' => ['id' => CustomerAddress::factory()->for($this->user)->create()->id],
    ])->assertForbidden();
});

test('grand total is recalculated when the shipping method is changed from insured to vault', function () {
    OrderItem::where('order_id', $this->insuredShippingOrder->id)->update([
        'declared_value_total' => 100,
        'quantity' => 2,
    ]);
    putJson(route('v2.customer.orders.update-shipping-method', ['order' => $this->insuredShippingOrder]), [
        'shipping_method_id' => $this->vaultShippingMethod->id,
    ])->assertOk();

    expect($this->insuredShippingOrder->refresh()->grand_total)->toBe(20.0);
});

test('grand total is recalculated when the shipping method is changed from vault to insured', function () {
    OrderItem::factory()->for($this->vaultShippingOrder)->create([
        'declared_value_total' => 100,
        'quantity' => 2,
    ]);
    putJson(route('v2.customer.orders.update-shipping-method', ['order' => $this->vaultShippingOrder]), [
        'shipping_method_id' => $this->insuredShippingMethod->id,
        'customer_address' => ['id' => CustomerAddress::factory()->for($this->user)->create()->id],
    ])->assertOk();

    expect($this->insuredShippingOrder->refresh()->grand_total)->toBe(34.0);
});

test('shipping address is saved when provided separately while changing shipping method', function () {
    OrderItem::factory()->for($this->vaultShippingOrder)->create([
        'declared_value_total' => 100,
        'quantity' => 2,
    ]);

    $address = [
        'first_name' => $this->faker->firstNameMale(),
        'last_name' => $this->faker->lastName(),
        'address' => $this->faker->streetAddress(),
        'city' => $this->faker->city(),
        'state' => $this->faker->stateAbbr(),
        'zip' => $this->faker->postcode(),
        'phone' => $this->faker->phoneNumber(),
        'flat' => $this->faker->buildingNumber(),
        'save_for_later' => false,
    ];
    putJson(route('v2.customer.orders.update-shipping-method', ['order' => $this->vaultShippingOrder]), [
        'shipping_method_id' => $this->insuredShippingMethod->id,
        'customer_address' => ['id'],
        'shipping_address' => $address,
    ])->assertOk();

    $shippingAddress = $this->vaultShippingOrder->refresh()->shippingAddress;

    expect($shippingAddress->first_name)->toBe($address['first_name']);
    expect($shippingAddress->last_name)->toBe($address['last_name']);
    expect($shippingAddress->address)->toBe($address['address']);
    expect($shippingAddress->state)->toBe($address['state']);
    expect($shippingAddress->zip)->toBe($address['zip']);
    expect($shippingAddress->phone)->toBe($address['phone']);
    expect($shippingAddress->flat)->toBe($address['flat']);
});

test('shipping address is saved for customer when provided separately while changing shipping method', function () {
    OrderItem::factory()->for($this->vaultShippingOrder)->create([
        'declared_value_total' => 100,
        'quantity' => 2,
    ]);

    $address = [
        'first_name' => $this->faker->firstNameMale(),
        'last_name' => $this->faker->lastName(),
        'address' => $this->faker->streetAddress(),
        'city' => $this->faker->city(),
        'state' => $this->faker->stateAbbr(),
        'zip' => $this->faker->postcode(),
        'phone' => $this->faker->phoneNumber(),
        'flat' => $this->faker->buildingNumber(),
        'save_for_later' => true,
    ];
    putJson(route('v2.customer.orders.update-shipping-method', ['order' => $this->vaultShippingOrder]), [
        'shipping_method_id' => $this->insuredShippingMethod->id,
        'customer_address' => ['id'],
        'shipping_address' => $address,
    ])->assertOk();

    $customerAddress = $this->vaultShippingOrder->refresh()->user->customerAddresses()->latest()->first();

    expect($customerAddress->first_name)->toBe($address['first_name']);
    expect($customerAddress->last_name)->toBe($address['last_name']);
    expect($customerAddress->address)->toBe($address['address']);
    expect($customerAddress->state)->toBe($address['state']);
    expect($customerAddress->zip)->toBe($address['zip']);
    expect($customerAddress->phone)->toBe($address['phone']);
    expect($customerAddress->flat)->toBe($address['flat']);
});
