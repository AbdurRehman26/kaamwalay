<?php

use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\User;
use App\Models\Wallet;
use App\Services\Admin\V2\OrderStatusHistoryService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;

beforeEach(function () {
    Event::fake();
    $this->user = User::factory()->create([
        'stripe_id' => Str::random(25),
    ]);

    $this->order = Order::factory()->create([
        'user_id' => $this->user->id,
        'coupon_id' => null,
        'payment_method_id' => 1,
        'order_status_id' => OrderStatus::PLACED,
    ]);

    $this->paymentMethod = PaymentMethod::factory()->create([
        'code' => 'stripe',
    ]);

    $this->actingAs($this->user);

    $orderStatusHistoryService = resolve(OrderStatusHistoryService::class);
    $orderStatusHistoryService->addStatusToOrder($this->order->order_status_id, $this->order->id);
    \Illuminate\Support\Facades\Bus::fake();

    Wallet::factory()->create([
        'user_id' => $this->user->id,
        'balance' => 50000,
    ]);

    config([
        'robograding.order_wallet_credit_percentage' => 5,
    ]);
});

test('credit added to user`s wallet if he pays within 24 hrs', function () {
    $walletAmount = $this->user->wallet->balance;

    $this->postJson("/api/v2/customer/orders/{$this->order->id}/payments", [
        'payment_method' => [
            'id' => 1,
        ],
        'payment_provider_reference' => [
            'id' => '12345678',
        ],
    ])
        ->assertOk()
        ->assertJsonStructure(['data' => ['id', 'charges']])
        ->assertJsonPath('data.amount', $this->order->refresh()->grand_total_cents);

    expect(round(Wallet::find($this->user->wallet->id)->balance, 2))->toBe(round($walletAmount + ($this->order->grand_total * 5 / 100), 2));
    expect(round($this->user->wallet->lastTransaction->amount, 2))->toBe(round(($this->order->grand_total * 5 / 100), 2));
})->group('order.wallet.credit');

test('credit is not added to user`s wallet if he pays after 24 hrs', function () {
    $walletAmount = $this->user->wallet->balance;

    $this->order->created_at = now()->subDays(3);
    $this->order->save();

    $this->postJson("/api/v2/customer/orders/{$this->order->id}/payments", [
        'payment_method' => [
            'id' => 1,
        ],
        'payment_provider_reference' => [
            'id' => '12345678',
        ],
    ])
        ->assertOk()
        ->assertJsonStructure(['data' => ['id', 'charges']])
        ->assertJsonPath('data.amount', $this->order->refresh()->grand_total_cents);

    expect(Wallet::find($this->user->wallet->id)->balance)->toBe($walletAmount);
})->group('order.wallet.credit');

test('credit is not added to user`s wallet if config flag is set to 0', function () {
    config([
        'robograding.order_wallet_credit_percentage' => 0,
    ]);

    $walletAmount = $this->user->wallet->balance;

    $this->order->created_at = now()->subDays(3);
    $this->order->save();

    $this->postJson("/api/v2/customer/orders/{$this->order->id}/payments", [
        'payment_method' => [
            'id' => 1,
        ],
        'payment_provider_reference' => [
            'id' => '12345678',
        ],
    ])
        ->assertOk()
        ->assertJsonStructure(['data' => ['id', 'charges']])
        ->assertJsonPath('data.amount', $this->order->refresh()->grand_total_cents);

    expect(Wallet::find($this->user->wallet->id)->balance)->toBe($walletAmount);
})->group('order.wallet.credit');
