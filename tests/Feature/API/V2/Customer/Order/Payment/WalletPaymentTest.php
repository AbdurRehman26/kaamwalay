<?php

use App\Events\API\Customer\Order\OrderPaid;
use App\Events\API\Order\V1\OrderStatusChangedEvent;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\User;
use App\Models\Wallet;
use App\Services\Admin\V2\OrderStatusHistoryService;
use function Pest\Laravel\postJson;

beforeEach(function () {
    Storage::fake('s3');
    Event::fake([
        OrderPaid::class,
        OrderStatusChangedEvent::class,
    ]);

    $this->user = User::factory()->create([
        'stripe_id' => Str::random(25),
    ]);

    $this->paymentMethod = PaymentMethod::factory()->wallet()->create();

    $this->order = Order::factory()->make([
        'user_id' => $this->user->id,
        'coupon_id' => null,
        'payment_method_id' => $this->paymentMethod->id,
        'order_status_id' => OrderStatus::PLACED,
    ]);

    $this->order->amount_paid_from_wallet = $this->order->grand_total;
    $this->order->save();


    Wallet::factory()->create([
        'user_id' => $this->user->id,
        'balance' => $this->order->grand_total + 1,
    ]);

    $this->actingAs($this->user);

    $orderStatusHistoryService = resolve(OrderStatusHistoryService::class);
    $orderStatusHistoryService->addStatusToOrder($this->order->order_status_id, $this->order->id);
});

test('user can be charged successfully from wallet', function () {
    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => $this->paymentMethod->id,
    ]);
    postJson("/api/v2/customer/orders/{$this->order->id}/payments", [
        'payment_method' => [
            'id' => $this->paymentMethod->id,
        ],
        'payment_provider_reference' => [
            'id' => '12345678',
        ],
    ])
        ->assertOk();

    expect($this->user->wallet->balance)->toBe((float) 1);
    expect($this->user->wallet->lastTransaction->amount)->toBe($this->order->grand_total);
})->group('payment');

test('user can be charged partially from wallet', function () {
    $oldWalletBalance = $this->user->wallet->balance;
    $newOrder = Order::factory()->make([
        'user_id' => $this->user->id,
        'coupon_id' => null,
        'payment_method_id' => 1,
        'order_status_id' => OrderStatus::PLACED,
    ]);
    $walletAmount = (float) 10;
    $newOrder->amount_paid_from_wallet = $walletAmount;
    $newOrder->save();

    OrderPayment::factory()->create([
        'order_id' => $newOrder->id,
        'payment_method_id' => 1,
    ]);
    OrderPayment::factory()->create([
        'order_id' => $newOrder->id,
        'payment_method_id' => $this->paymentMethod->id,
    ]);

    postJson("/api/v2/customer/orders/{$newOrder->id}/payments", [
        'payment_method' => [
            'id' => 1,
        ],
        'payment_provider_reference' => [
            'id' => '12345678',
        ],
        'payment_by_wallet' => 10.00,
    ])
        ->assertOk();
    
    expect($this->user->wallet->refresh()->balance)->toBe($oldWalletBalance - $walletAmount);
    expect($this->user->wallet->lastTransaction->amount)->toBe($walletAmount);
})->group('payment');
