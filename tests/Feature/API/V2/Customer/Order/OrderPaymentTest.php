<?php

use App\Models\CardProduct;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;

use App\Models\Wallet;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;

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

    actingAs($this->user);
});

test('a customer can not pay from wallet if wallet has insufficient balance', function () {
    $order = Order::factory()->for($this->user)->create();

    postJson('/api/v2/customer/orders/' . $order->id . '/order-payments', [
        'payment_method' => [
            'id' => $this->paymentMethod->id,
        ],
        'payment_provider_reference' => [
            'id' => '12345678',
        ],
        'payment_by_wallet' => 10,
    ])->assertUnprocessable();
});


test('a customer can not place order with partial amount from wallet without payment method', function () {
    Wallet::factory()->create([
        'user_id' => $this->user->id,
        'balance' => 50,
    ]);
    $order = Order::factory()->for($this->user)->create();
    $walletPayment = (float) 10;

    postJson('/api/v2/customer/orders/' . $order->id . '/order-payments', [
        'payment_method' => null,
        'payment_by_wallet' => $walletPayment,
    ])->assertUnprocessable();
});

test('a customer can place order with amount equal to his wallet balance.', function () {
    $order = Order::factory()->for($this->user)->create([
        'shipping_fee' => 10,
        'service_fee' => 10,
        'grand_total' => 20,
    ]);

    Wallet::factory()->create([
        'user_id' => $this->user->id,
        'balance' => $order->grand_total,
    ]);

    postJson('/api/v2/customer/orders/' . $order->id . '/order-payments', [
        'payment_method' => null,
        'payment_by_wallet' => $order->grand_total,
    ])->assertSuccessful();
});
