<?php

use App\Events\API\Customer\Order\OrderPaid;
use App\Events\API\Order\OrderStatusChangedEvent;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\User;
use App\Models\Wallet;
use App\Services\Admin\OrderStatusHistoryService;

use function Pest\Laravel\postJson;

beforeEach(function () {
    Storage::fake('s3');

    $this->user = User::factory()->create([
        'stripe_id' => Str::random(25),
    ]);

    $this->order = Order::factory()->make([
        'user_id' => $this->user->id,
        'coupon_id' => null,
        'payment_method_id' => 3,
        'order_status_id' => OrderStatus::PAYMENT_PENDING,
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

    Event::fake([
        OrderPaid::class,
        OrderStatusChangedEvent::class,
    ]);
});

test('user can be charged successfully from wallet', function () {
    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => 3,
    ]);
    postJson("/api/v1/customer/orders/{$this->order->id}/payments")
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
        'order_status_id' => OrderStatus::PAYMENT_PENDING,
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
        'payment_method_id' => 3,
    ]);

    postJson("/api/v1/customer/orders/{$newOrder->id}/payments")
        ->assertOk();
    
    expect($this->user->wallet->refresh()->balance)->toBe($oldWalletBalance - $walletAmount);
    expect($this->user->wallet->lastTransaction->amount)->toBe($walletAmount);
})->group('payment');
