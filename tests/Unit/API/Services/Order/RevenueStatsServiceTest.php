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

it('adds daily revenue stats', function () {
    $profit = ($this->order->service_fee - $this->order->orderPayment->provider_fee);
    $revenue = $this->order->grand_total;
    $revenueStats = $this->revenueStatsService->addDailyStats(Carbon::now()->toDateString());
    expect($revenue)->toBe($revenueStats['revenue']);
    expect($profit)->toBe($revenueStats['profit']);
})->group('revenue-stats');

it('adds monthly revenue stats', function () {
    $orders = Order::factory()
        ->count(2)
        ->state(new Sequence(
            [
                'created_at' => '2020-09-01',
                'payment_method_id' => 1,
                'order_status_id' => OrderStatus::PLACED,

            ],
            [
                'created_at' => '2020-08-01',
                'payment_method_id' => 1,
                'order_status_id' => OrderStatus::PLACED,
            ],
        ))
        ->create();
    $orders->each(function ($order) {
        $orderPayment = OrderPayment::factory()->state(new Sequence(['created_at' => $order->created_at]))->for($order)->stripe()->create();
            
        $this->paymentService->calculateAndSaveFee($orderPayment->order);
        $profit = ($order->service_fee - $order->orderPayment->provider_fee);
        $revenue = $order->grand_total;
        $revenueStats = $this->revenueStatsService->addMonthlyStats($order->created_at);
        //dd($profit , $revenue, $revenueStats, $order->orderPayment->provider_fee);
        expect($revenue)->toBe($revenueStats['revenue']);
        expect($profit)->toBe($revenueStats['profit']);
    });
})->group('revenue-stats');
