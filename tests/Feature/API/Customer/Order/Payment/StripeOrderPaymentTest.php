<?php

use App\Exceptions\Services\Payment\PaymentNotVerified;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Services\Payment\Providers\TestingStripeService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

beforeEach(function () {
    $user = User::factory()->create([
        'stripe_id' => Str::random(25),
    ]);
    $this->order = Order::factory()->create([
        'user_id' => $user->id,
        'payment_method_id' => 1,
    ]);

    $this->orderStatusHistory = OrderStatusHistory::factory()->create([
        'user_id' => $user->id,
        'order_id' => $this->order->id,
        'order_status_id' => OrderStatus::PAYMENT_PENDING,
    ]);

    $this->actingAs($user);
    Event::fake();
});

test('user can be charged successfully', function () {
    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 1,
        'payment_provider_reference_id' => Str::random(25),
    ]);
    $response = $this->postJson("/api/customer/orders/{$this->order->id}/payments");

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
    $response = $this->postJson("/api/customer/orders/{$this->order->id}/payments");

    $response->assertStatus(Response::HTTP_PAYMENT_REQUIRED);
    $response->assertJsonStructure(['payment_intent' => ['id']]);
})->group('payment');

test('user can verify a successful payment', function () {
    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 1,
        'payment_provider_reference_id' => Str::random(25),
    ]);
    $response = $this->postJson("/api/customer/orders/{$this->order->id}/payments/" . Str::random(25));
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
    $response = $this->postJson("/api/customer/orders/{$this->order->id}/payments/incomplete");
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
    ]);
    $response = $this->postJson("/api/customer/orders/{$this->order->id}/payments");

    $response->assertOk();
    $response->assertJsonPath('data.amount', $this->order->grand_total_cents);
    $this->order->refresh();
    $totalAmount = $this->order->grand_total_cents;
    $actualFee = round((float) (
        (TestingStripeService::STRIPE_FEE_PERCENTAGE * $totalAmount) + TestingStripeService::STRIPE_FEE_ADDITIONAL_AMOUNT
    ) / 100, 2);

    expect($actualFee)->toBe($this->order->orderPayment->provider_fee);
})->group('payment');
