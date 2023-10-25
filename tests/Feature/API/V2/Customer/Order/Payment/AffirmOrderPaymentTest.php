<?php

use App\Exceptions\Services\Payment\PaymentNotVerified;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

beforeEach(function () {

    PaymentMethod::where('id', '=', 7)->delete();

    Event::fake();
    $user = User::factory()->create([
        'stripe_id' => Str::random(25),
    ]);

    $this->paymentMethod = PaymentMethod::factory()->create([
        'id' => 7,
        'code' => 'stripe_affirm',
    ]);

    $this->order = Order::factory()->create([
        'user_id' => $user->id,
        'coupon_id' => null,
        'payment_method_id' => 1,
        'order_status_id' => OrderStatus::PLACED,
    ]);

    $this->actingAs($user);
});

test('user can create payment intent with affirm', function () {
    $this->postJson("/api/v2/customer/orders/{$this->order->id}/payments", [
        'payment_method' => [
            'id' => 7,
        ],
    ])
        ->dump()
        ->assertStatus(Response::HTTP_PAYMENT_REQUIRED)
        ->assertJsonStructure(['payment_intent']);

})->group('payment');

test('user can verify a successful affirm payment', function () {
    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 7,
        'payment_provider_reference_id' => Str::random(25),
    ]);
    $response = $this->postJson("/api/v2/customer/orders/{$this->order->id}/payments/".Str::random(25));
    $response->assertOk();
    $response->assertJson([
        'message' => 'Payment verified successfully',
    ]);
})->group('payment');

test('user cannot verify a failed payment', function () {
    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 7,
        'payment_provider_reference_id' => 'incomplete',
    ]);
    $response = $this->postJson("/api/v2/customer/orders/{$this->order->id}/payments/incomplete");
    $exception = new PaymentNotVerified();
    $response->assertStatus($exception->getCode());
    $response->assertJson([
        'error' => $exception->getMessage(),
    ]);
})->group('payment');

test('affirm payment requires grand total to be more than 50', function () {

    $this->order->update([
        'grand_total' => 49,
    ]);

    $this->postJson("/api/v2/customer/orders/{$this->order->id}/payments", [
        'payment_method' => [
            'id' => $this->paymentMethod->id,
        ],
        'payment_provider_reference' => [
            'id' => '',
        ],
    ])->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
        ->assertJsonValidationErrors([
            'message' => 'Minimum order amount for affirm payment method is 50',
        ]);
})->group('payment');
