<?php

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\Order;
use App\Models\OrderCustomerShipment;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Services\Order\UnpaidOrdersStatsService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;

uses(WithFaker::class);

beforeEach(function () {
    $this->unpaidOrdersStatsService = resolve(UnpaidOrdersStatsService::class);

    $orderCustomerShipment = OrderCustomerShipment::factory()->create();
    $this->orders = Order::factory()
        ->count(100)
        ->create(new Sequence(
            function () use ($orderCustomerShipment) {
                return [
                    'order_customer_shipment_id' => $this->faker->randomElement([null, $orderCustomerShipment->id]),
                    'order_status_id' => $this->faker->randomElement([
                        OrderStatus::PLACED,
                        OrderStatus::CONFIRMED,
                        OrderStatus::GRADED,
                    ]),
                    'created_at' => $this->faker->dateTimeBetween('-2 month', 'now'),
                    'updated_at' => $this->faker->dateTimeBetween('-2 month', 'now'),
                    'payment_status' => $this->faker->randomElement([0, 1]),
                ];
            }
        ));

    $user = User::factory()->create();
    $orderStatusHistoryData = $this->orders->map(function ($order) use ($user) {
        return [
            'order_id' => $order->id,
            'order_status_id' => OrderStatus::PLACED,
            'user_id' => $user->id,
        ];
    })->toArray();

    OrderStatusHistory::insert($orderStatusHistoryData);
});

it('calculates daily unpaid orders stats', function () {
    $startDateTime = Carbon::now()->subDay();
    $endDateTime = Carbon::now();

    $expectedUnpaidTotal = Order::placed()->where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value)->where(function (Builder $query) use ($startDateTime, $endDateTime) {
        $query->whereHas('orderCustomerShipment')->orWhere('order_status_id', OrderStatus::CONFIRMED)->whereBetween('created_at', [$startDateTime, $endDateTime]);
    })->sum('grand_total');

    $unpaidDailyStats = $this->unpaidOrdersStatsService->calculateDailyStats($startDateTime, $endDateTime);

    expect($unpaidDailyStats['unpaid_total'])->toBeGreaterThan(0)
        ->and($unpaidDailyStats['unpaid_total'])->toBe($expectedUnpaidTotal);
})->group('unpaid-orders-stats');

it('calculates monthly unpaid orders stats for the current month', function () {
    $startDateTime = Carbon::now()->subDay();
    $monthStart = Carbon::parse($startDateTime)->firstOfMonth()->addHours(4);
    $monthEnd = Carbon::parse($startDateTime)->endOfMonth()->addHours(4);

    $expectedUnpaidTotal = Order::placed()->where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value)->where(function (Builder $query) use ($monthStart, $monthEnd) {
        $query->whereHas('orderCustomerShipment')->orWhere('order_status_id', OrderStatus::CONFIRMED)->whereBetween('created_at', [$monthStart, $monthEnd]);
    })->sum('grand_total');

    $unpaidMonthlyStats = $this->unpaidOrdersStatsService->calculateMonthlyStats($startDateTime);

    expect($unpaidMonthlyStats['unpaid_total'])->toBeGreaterThan(0)
        ->and($unpaidMonthlyStats['unpaid_total'])->toBe($expectedUnpaidTotal);
})->group('unpaid-orders-stats');

it('counts daily unpaid orders cards', function () {
    $expectedCardTotal = Order::placed()->where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value)
        ->join('order_items', 'order_items.order_id', '=', 'orders.id')
        ->whereBetween('orders.created_at', [Carbon::now()->subDays(1)->startOfDay(), Carbon::now()->subDays(1)->endOfDay()])
        ->where(function (Builder $query) {
            $query->whereHas('orderCustomerShipment')->orWhere('order_status_id', OrderStatus::CONFIRMED);
        })->sum('order_items.quantity');

    $cardTotal = $this->unpaidOrdersStatsService->calculateDailyCardsTotal(Carbon::now()->subDays(1)->startOfDay(), Carbon::now()->subDays(1)->endOfDay());

    expect((int) $expectedCardTotal)->toBe($cardTotal);
})->group('unpaid-orders-stats');

it('counts monthly unpaid orders cards', function () {
    $expectedCardTotal = Order::placed()->where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value)
        ->join('order_items', 'order_items.order_id', '=', 'orders.id')
        ->whereBetween('orders.created_at', [Carbon::now()->subDays(1)->startOfMonth()->addHours(4), Carbon::now()->subDays(1)->endOfMonth()->addHours(4)])
        ->where(function (Builder $query) {
            $query->whereHas('orderCustomerShipment')->orWhere('order_status_id', OrderStatus::CONFIRMED);
        })->sum('order_items.quantity');

    $cardTotal = $this->unpaidOrdersStatsService->calculateMonthlyCardsTotal(Carbon::now());

    expect((int) $expectedCardTotal)->toBe($cardTotal);
})->group('unpaid-orders-stats');
