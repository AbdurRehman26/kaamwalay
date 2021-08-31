<?php

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\User;
use App\Services\Payment\Providers\TestingStripeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->stripe = new TestingStripeService;
});

it('can generate stripe customer id', function () {
    $user = User::factory()->create();
    $this->stripe->createCustomerIfNull($user);
    $user->refresh();
    $this->assertTrue($user->hasStripeId());
})->group('payment');

test('is successfully validates a paid order', function () {
    /** @var Order $order */
    $order = Order::factory()->create();
    OrderPayment::factory()->create([
        'order_id' => $order->id,
        'payment_method_id' => 1,
    ]);
    $result = $this->stripe->verify($order, Str::random(25));

    $this->assertTrue($result);
})->group('payment');

test('is successfully invalidates unpaid order', function () {
    $order = Order::factory()->create();
    OrderPayment::factory()->create([
        'order_id' => $order->id,
        'payment_method_id' => 1,
    ]);
    $result = $this->stripe->verify($order, 'incomplete');

    $this->assertFalse($result);
})->group('payment');

it('charges user successfully', function () {
    $order = Order::factory()->create();
    OrderPayment::factory()->create([
        'order_id' => $order->id,
        'payment_method_id' => 1,
        'payment_provider_reference_id' => Str::random(25),
    ]);
    $result = $this->stripe->charge($order);

    $this->assertArrayHasKey('success', $result);
})->group('payment');

it('fails to charge user', function () {
    $order = Order::factory()->create();
    OrderPayment::factory()->create([
        'order_id' => $order->id,
        'payment_method_id' => 1,
        'payment_provider_reference_id' => 'incomplete',
    ]);
    $result = $this->stripe->charge($order);

    $this->assertArrayHasKey('payment_intent', $result);
})->group('payment');

it('calculates fee', function () {
    $order = Order::factory()->create();
    $actualFee = round((
        (TestingStripeService::STRIPE_FEE_PERCENTAGE * $order->grand_total_cents) + TestingStripeService::STRIPE_FEE_ADDITIONAL_AMOUNT
    ) / 100, 2);
    $calculatedFee = $this->stripe->calculateFee($order);
    $this->assertSame($calculatedFee, $actualFee);
})->group('payment');

it('returns payment cards for user', function () {
    $user = User::factory()->create();
    $result = $this->stripe->getUserPaymentMethods($user);

    $this->assertArrayHasKey(0, $result);
    $this->assertArrayHasKey('id', $result[0]);
    $this->assertArrayHasKey('customer', $result[0]);
})->group('payment');

it('returns payment setup intent for user', function () {
    $user = User::factory()->create();
    $result = $this->stripe->createSetupIntent($user);

    $this->assertArrayHasKey('client_secret', $result);
    $this->assertArrayHasKey('customer', $result);
})->group('payment');
