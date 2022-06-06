<?php

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\Order;
use App\Models\OrderCustomerShipment;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Services\Order\UnpaidOrdersStatsService;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\WithFaker;

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
                        OrderStatus::REVIEWED,
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

    $this->ordersForTests = Order::placed()->whereHas('orderCustomerShipment')->where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value);
});

it('calculates daily unpaid orders stats', function () {
    $orders = $this->ordersForTests;
    $randomOrderDate = $orders->inRandomOrder()->first()->created_at->toDateString();

    $expectedUnpaidTotal = $orders->forDate($randomOrderDate)->sum('grand_total');

    $unpaidDailyStats = $this->unpaidOrdersStatsService->calculateDailyStats($randomOrderDate);

    expect($unpaidDailyStats['unpaid_total'])->toBeGreaterThan(0)
        ->and($unpaidDailyStats['unpaid_total'])->toBe($expectedUnpaidTotal);
})->group('unpaid-orders-stats');

it('calculates monthly unpaid orders stats for the current month', function () {
    $orders = $this->ordersForTests;
    $randomOrderDate = $orders->inRandomOrder()->first()->created_at->toDateString();

    $expectedUnpaidTotal = $orders->forMonth($randomOrderDate)->sum('grand_total');

    $unpaidMonthlyStats = $this->unpaidOrdersStatsService->calculateMonthlyStats($randomOrderDate);

    expect($unpaidMonthlyStats['unpaid_total'])->toBeGreaterThan(0)
        ->and($unpaidMonthlyStats['unpaid_total'])->toBe($expectedUnpaidTotal);
})->group('unpaid-orders-stats');
