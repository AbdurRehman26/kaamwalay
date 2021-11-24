<?php

use App\Events\API\Order\OrderStatusChangedEvent;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Order\RevenueStatsService;
use App\Services\Payment\PaymentService;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;

uses(WithFaker::class);

beforeEach(function () {
    Event::fake([
        OrderStatusChangedEvent::class,
    ]);
    $this->revenueStatsService = resolve(RevenueStatsService::class);
    $this->paymentService = resolve(PaymentService::class);

    $this->orders = Order::factory()
        ->count(100)
        ->withPayment()
        ->create(new Sequence(
            function () {
                return [
                'payment_method_id' => 1,
                'order_status_id' => $this->faker->randomElement([
                    OrderStatus::PLACED,
                    OrderStatus::CONFIRMED,
                    OrderStatus::GRADED,
                    OrderStatus::SHIPPED,
                    OrderStatus::CANCELLED,
                    OrderStatus::REVIEWED,
                ]),
                'created_at' => $this->faker->dateTimeBetween('-2 month', 'now'),
                'updated_at' => $this->faker->dateTimeBetween('-2 month', 'now'),
            ];
            }
        ));
});

it('adds daily revenue stats', function () {
    $getRandomOrder = $this->orders->random()->first();

    $orders = Order::whereDate('created_at', $getRandomOrder->created_at->toDateString())
        ->where('order_status_id', '<>', OrderStatus::PAYMENT_PENDING)
        ->get();

    $serviceFee = $orders->sum('service_fee');
    $providerFee = $orders->sum(function ($order) {
        return $order->firstOrderPayment->provider_fee
            + $order->extraCharges->sum('provider_fee');
    });

    $profit = ($serviceFee - $providerFee);

    $revenue = $orders->sum(
        fn (Order $order) => (
            $order->firstOrderPayment->amount + $order->extraCharges->sum('amount') - $order->refunds->sum('amount')
        )
    );

    $revenueStats = $this->revenueStatsService->addDailyStats($getRandomOrder->created_at->toDateString());
    expect($revenue)->toBe($revenueStats['revenue']);
    expect($profit)->toBe($revenueStats['profit']);
})->group('revenue-stats');

it('adds monthly revenue stats for the current month', function () {
    $orders = Order::whereBetween('created_at', [now()->addMonth(-1)->startOfMonth(), now()->addMonth(-1)->endOfMonth()])
        ->where('order_status_id', '<>', OrderStatus::PAYMENT_PENDING)
        ->get();

    $serviceFee = $orders->sum('service_fee');
    $providerFee = $orders->sum(function ($order) {
        return $order->firstOrderPayment->provider_fee
            + $order->extraCharges->sum('provider_fee');
    });

    $profit = ($serviceFee - $providerFee);
    $revenue = $orders->sum(
        fn (Order $order) => (
            $order->firstOrderPayment->amount + $order->extraCharges->sum('amount') - $order->refunds->sum('amount')
        )
    );

    $revenueStats = $this->revenueStatsService->addMonthlyStats(now()->addMonth(-1)->startOfMonth()->toDateString());

    expect($revenue)->toBe($revenueStats->revenue);
    expect($profit)->toBe($revenueStats->profit);
})->group('revenue-stats');
