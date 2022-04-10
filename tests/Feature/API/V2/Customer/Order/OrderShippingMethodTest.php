<?php

use App\Models\CardProduct;
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
    $this->insuredShippingMethod = ShippingMethod::factory()->create([
        'code' => ShippingMethod::INSURED_SHIPPING,
    ]);
    $this->vaultShippingMethod = ShippingMethod::factory()->create([
        'code' => ShippingMethod::VAULT_STORAGE,
    ]);
    $this->paymentMethod = PaymentMethod::factory()->create();
    $this->orderStatusHistoryService = resolve(OrderStatusHistoryService::class);
    $this->actingAs($this->user);
    $this->order = Order::factory()->for($this->user)->create([
        'shipping_method_id' => $this->insuredShippingMethod->id,
    ]);
    OrderItem::factory()->for($this->order)->create();
});

test('order\'s shipping method can be changed from insured shipping to vault', function () {
    putJson(route('v2.customer.orders.update-shipping-method', ['order' => $this->order]), [
        'shipping_method_id' => $this->vaultShippingMethod->id,
    ])->assertOk();
    expect($this->order->refresh()->shippingMethod->code)->toBe(ShippingMethod::VAULT_STORAGE);
});


test('order\'s shipping method can be changed from vault to insured shipping', function () {
    $order = Order::factory()->for($this->user)->create([
        'shipping_method_id' => $this->vaultShippingMethod->id,
    ]);
    OrderItem::factory()->for($order)->create();
    putJson(route('v2.customer.orders.update-shipping-method', ['order' => $order]), [
        'shipping_method_id' => $this->insuredShippingMethod->id,
        'customer_address_id' => \App\Models\CustomerAddress::factory()->for($this->user)->create()->id,
    ])->assertOk();
    expect($this->order->refresh()->shippingMethod->code)->toBe(ShippingMethod::INSURED_SHIPPING);
});

test('when order shipping method is changed from insured to vault, shipping fee is calculated as 0', function () {
    putJson(route('v2.customer.orders.update-shipping-method', ['order' => $this->order]), [
        'shipping_method_id' => $this->vaultShippingMethod->id,
    ])->assertOk();

    expect($this->order->refresh()->shipping_fee)->toBe(0.0);
});

test('when order shipping method is changed from vault to insured, shipping fee is calculated', function () {
    $order = Order::factory()->for($this->user)->create([
        'shipping_method_id' => $this->vaultShippingMethod->id,
        'shipping_fee' => 0,
    ]);

    OrderItem::factory()->for($order)->create([
        'declared_value_total' => 100,
        'quantity' => 2,
    ]);

    putJson(route('v2.customer.orders.update-shipping-method', ['order' => $order]), [
        'shipping_method_id' => $this->insuredShippingMethod->id,
        'customer_address_id' => \App\Models\CustomerAddress::factory()->for($this->user)->create()->id,
    ])->assertOk();

    expect($order->refresh()->shipping_fee)->toBe(14.0);
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
        'customer_address_id' => \App\Models\CustomerAddress::factory()->for($this->user)->create()->id,
    ])->assertForbidden();
});
