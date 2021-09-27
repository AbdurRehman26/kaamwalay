<?php

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Admin\OrderStatusHistoryService;
use App\Services\Order\RevenueStatsService;
use App\Services\Payment\PaymentService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Sequence;

beforeEach(function () {
    $this->revenueStatsService = resolve(RevenueStatsService::class);
    $this->paymentService = resolve(PaymentService::class);

    $this->order = Order::factory()->state(new Sequence(
        ['payment_method_id' => 1, 'order_status_id' => OrderStatus::PLACED]
    ))->create();

    $user = User::factory()->create();

    $orderStatusHistoryService = resolve(OrderStatusHistoryService::class);
    $orderStatusHistoryService->addStatusToOrder($this->order->order_status_id, $this->order->id, $user->id);

    $this->orderPayment = OrderPayment::factory()->for($this->order)->stripe()->create();

    $this->paymentService->calculateAndSaveFee($this->orderPayment->order);
});

it('adds revenue stats', function () {
    $profit = ($this->order->service_fee - $this->order->orderPayment->provider_fee);
    $revenue = $this->order->grand_total;
    $revenueStats = $this->revenueStatsService->addDailyStats(Carbon::now()->toDateString());
    expect($revenue)->toBe($revenueStats['revenue']);
    expect($profit)->toBe($revenueStats['profit']);
})->group('revenue-stats');
