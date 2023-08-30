<?php

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Events\API\Order\V1\OrderStatusChangedEvent;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Services\Order\RevenueStatsService;
use App\Services\Payment\V1\PaymentService;
use Illuminate\Support\Carbon;
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
                    ]),
                    'created_at' => $this->faker->dateTimeBetween('-2 month', 'now'),
                    'updated_at' => $this->faker->dateTimeBetween('-2 month', 'now'),
                    'payment_status' => $this->faker->randomElement([0, 1, 2]),
                ];
            }
        ));

    foreach ($this->orders as $order) {
        OrderItem::factory()->for($order)->create();
    }
});

it('adds daily revenue stats', function () {
    $startDateTime = Carbon::now()->subDay();
    $endDateTime = Carbon::now();

    $orders = Order::whereBetween('created_at', [$startDateTime, $endDateTime])
        ->where('payment_status', OrderPaymentStatusEnum::PAID->value)
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

    $revenueStats = $this->revenueStatsService->addDailyStats($startDateTime, $endDateTime);
    expect(round($revenue, 2))->toBe(round($revenueStats['revenue'], 2));
    expect(round($profit, 2))->toBe(round($revenueStats['profit'], 2));
})->group('revenue-stats');

it('adds monthly revenue stats for the current month', function () {
    $orders = Order::whereBetween('created_at', [now()->addMonth(-1)->startOfMonth(), now()->addMonth(-1)->endOfMonth()])
        ->where('payment_status', OrderPaymentStatusEnum::PAID->value)
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

    $revenueStats = $this->revenueStatsService->addMonthlyStats(now()->addMonth(-1)->startOfMonth());

    expect($revenue)->toBe($revenueStats['revenue']);
    expect(round($profit, 2))->toBe(round($revenueStats['profit'], 2));
})->group('revenue-stats');

it('counts daily paid orders cards', function () {
    $expectedCardTotal = Order::paid()->join('users', 'users.id', '=', 'orders.user_id')->whereNotIn(
        'users.email',
        Str::of(config('robograding.revenue_ignore_orders_admins'))->explode(',')->toArray()
    )
        ->join('order_items', 'order_items.order_id', '=', 'orders.id')
        ->whereBetween('orders.created_at', [Carbon::now()->subDays(1)->startOfDay(), Carbon::now()->subDays(1)->endOfDay()])
        ->sum('order_items.quantity');

    $cardTotal = $this->revenueStatsService->calculateDailyCardsTotal(Carbon::now()->subDays(1)->startOfDay(), Carbon::now()->subDays(1)->endOfDay());

    expect((int) $expectedCardTotal)->toBe($cardTotal);
})->group('revenue-stats');

it('counts monthly paid orders cards', function () {
    $expectedCardTotal = Order::paid()->join('users', 'users.id', '=', 'orders.user_id')->whereNotIn(
        'users.email',
        Str::of(config('robograding.revenue_ignore_orders_admins'))->explode(',')->toArray()
    )
        ->join('order_items', 'order_items.order_id', '=', 'orders.id')
        ->whereBetween('orders.created_at', [Carbon::now()->subDays(1)->startOfMonth(), Carbon::now()->subDays(1)->endOfMonth()])
        ->sum('order_items.quantity');

    $cardTotal = $this->revenueStatsService->calculateMonthlyCardsTotal(Carbon::now());

    expect((int) $expectedCardTotal)->toBe($cardTotal);
})->group('revenue-stats');
