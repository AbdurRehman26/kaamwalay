<?php

use App\Events\API\Customer\Order\OrderPaid;
use App\Listeners\API\Order\V2\CreditCustomerForPayNowAndSave;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\User;
use App\Models\Wallet;
use App\Services\Admin\V2\OrderStatusHistoryService;
use App\Services\Wallet\WalletService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;

beforeEach(function () {
    Event::fake();
    Bus::fake();

    $this->user = User::factory()->create([
        'stripe_id' => Str::random(25),
    ]);

    $this->order = Order::factory()->create([
        'user_id' => $this->user->id,
        'coupon_id' => null,
        'payment_method_id' => 1,
        'order_status_id' => OrderStatus::PLACED,
    ]);

    $this->actingAs($this->user);

    $orderStatusHistoryService = resolve(OrderStatusHistoryService::class);
    $orderStatusHistoryService->addStatusToOrder($this->order->order_status_id, $this->order->id);

    Wallet::factory()->create([
        'user_id' => $this->user->id,
        'balance' => 50000,
    ]);

    config([
        'robograding.feature_order_wallet_credit_enabled' => true,
        'robograding.feature_order_wallet_credit_percentage' => 5,
    ]);
});

test('credit added to user`s wallet if he pays within 24 hrs', function () {
    $walletAmount = $this->user->wallet->balance;

    $listener = new CreditCustomerForPayNowAndSave(new WalletService());
    $listener->handle(new OrderPaid(Order::find($this->order->id)));

    $walletCreditAmount = ($this->order->grand_total * config('robograding.feature_order_wallet_credit_percentage')) / 100;

    expect(round(Wallet::find($this->user->wallet->id)->balance, 2))->toBe(round($walletAmount + $walletCreditAmount, 2));
    expect(round($this->user->wallet->lastTransaction->amount, 2))->toBe(round($walletCreditAmount, 2));
})->group('order.wallet.credit');

test('credit is not added to user`s wallet if he pays after 24 hrs', function () {
    $walletAmount = $this->user->wallet->balance;

    $this->order->created_at = now()->subDays(3);
    $this->order->save();

    $listener = new CreditCustomerForPayNowAndSave(new WalletService());
    $listener->handle(new OrderPaid(Order::find($this->order->id)));

    expect(Wallet::find($this->user->wallet->id)->balance)->toBe($walletAmount);
})->group('order.wallet.credit');

test('credit is not added to user`s wallet if config flag is disabled via config', function () {
    config([
        'robograding.feature_order_wallet_credit_enabled' => false,
    ]);

    $walletAmount = $this->user->wallet->balance;

    $listener = new CreditCustomerForPayNowAndSave(new WalletService());
    $listener->handle(new OrderPaid(Order::find($this->order->id)));

    expect(Wallet::find($this->user->wallet->id)->balance)->toBe($walletAmount);
})->group('order.wallet.credit');
