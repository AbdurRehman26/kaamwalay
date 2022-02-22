<?php

use App\Exceptions\Services\Payment\PaymentNotVerified;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Admin\V2\OrderStatusHistoryService;
use App\Services\Payment\V2\Providers\TestingStripeService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

beforeEach(function () {
    Event::fake();
    $user = User::factory()->create([
        'stripe_id' => Str::random(25),
    ]);

    $this->order = Order::factory()->create([
        'user_id' => $user->id,
        'coupon_id' => null,
        'payment_method_id' => 1,
        'order_status_id' => OrderStatus::PLACED,
    ]);

    $this->actingAs($user);
    
    $orderStatusHistoryService = resolve(OrderStatusHistoryService::class);
    $orderStatusHistoryService->addStatusToOrder($this->order->order_status_id, $this->order->id);
    \Illuminate\Support\Facades\Bus::fake();
});

test('user can be charged successfully', function () {
    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 1,
        'payment_provider_reference_id' => Str::random(25),
    ]);
    $response = $this->postJson("/api/v2/customer/orders/{$this->order->id}/payments");

    $response->assertOk();
    $response->assertJsonStructure(['data' => ['id', 'charges']]);
    $response->assertJsonPath('data.amount', $this->order->grand_total_cents);
})->group('payment');

test('user receives incomplete payment response', function () {
    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 1,
        'payment_provider_reference_id' => 'incomplete',
    ]);
    $response = $this->postJson("/api/v2/customer/orders/{$this->order->id}/payments");

    $response->assertStatus(Response::HTTP_PAYMENT_REQUIRED);
    $response->assertJsonStructure(['payment_intent' => ['id']]);
})->group('payment');

test('user can verify a successful payment', function () {
    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 1,
        'payment_provider_reference_id' => Str::random(25),
    ]);
    $response = $this->postJson("/api/v2/customer/orders/{$this->order->id}/payments/" . Str::random(25));
    $response->assertOk();
    $response->assertJson([
        'message' => 'Payment verified successfully',
    ]);
})->group('payment');

test('user cannot verify a failed payment', function () {
    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 1,
        'payment_provider_reference_id' => 'incomplete',
    ]);
    $response = $this->postJson("/api/v2/customer/orders/{$this->order->id}/payments/incomplete");
    $exception = new PaymentNotVerified();
    $response->assertStatus($exception->getCode());
    $response->assertJson([
        'error' => $exception->getMessage(),
    ]);
})->group('payment');

test('provider fee is set after a successful payment', function () {
    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 1,
        'payment_provider_reference_id' => Str::random(25),
        'amount' => $this->order->grand_total,
    ]);
    $response = $this->postJson("/api/v2/customer/orders/{$this->order->id}/payments");

    $response->assertOk();
    $response->assertJsonPath('data.amount', $this->order->grand_total_cents);
    $this->order->refresh();
    $totalAmount = $this->order->grand_total_cents;
    $actualFee = round((float) (
        (TestingStripeService::STRIPE_FEE_PERCENTAGE * $totalAmount) + TestingStripeService::STRIPE_FEE_ADDITIONAL_AMOUNT
    ) / 100, 2);

    expect($actualFee)->toBe($this->order->lastOrderPayment->provider_fee);
})->group('payment');

test('test payment', function () {
    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 1,
        'payment_provider_reference_id' => Str::random(25),
        'amount' => 40,
        'type' => OrderPayment::TYPE_EXTRA_CHARGE,
        'created_at' => now()->addSeconds(15),
    ]);
    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 1,
        'payment_provider_reference_id' => Str::random(25),
        'amount' => 10,
        'type' => OrderPayment::TYPE_REFUND,
        'created_at' => now()->addSeconds(10),
    ]);

    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 1,
        'payment_provider_reference_id' => Str::random(25),
        'amount' => $this->order->grand_total,
        'type' => OrderPayment::TYPE_ORDER_PAYMENT,
    ]);
    $this->order->update([
        'refund_total' => 10,
        'extra_charge_total' => 40,
        'grand_total' => $this->order->grand_total + 30,
    ]);

    $response = $this->postJson("/api/v2/customer/orders/{$this->order->id}/payments");

    $response->assertOk();
    $response->assertJsonPath('data.amount', $this->order->grand_total_cents);
    dump($this->order->firstOrderPayment->toArray());
    dump($this->order->orderPayments->toArray());
//    $this->order->refresh();
//    $totalAmount = $this->order->grand_total_cents;
//    $actualFee = round((float) (
//            (TestingStripeService::STRIPE_FEE_PERCENTAGE * $totalAmount) + TestingStripeService::STRIPE_FEE_ADDITIONAL_AMOUNT
//        ) / 100, 2);
//
//    expect($actualFee)->toBe($this->order->lastOrderPayment->provider_fee);
})->group('payment');
