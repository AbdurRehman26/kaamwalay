<?php

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Events\API\Order\V1\OrderStatusChangedEvent;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Order\UnpaidOrdersStatsService;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;

uses(WithFaker::class);

beforeEach(function () {
    Event::fake([
        OrderStatusChangedEvent::class,
    ]);
    $this->unpaidOrdersStatsService = resolve(UnpaidOrdersStatsService::class);

    $this->orders = Order::factory()
        ->count(100)
        ->create(new Sequence(
            function () {
                return [
                    'order_status_id' => $this->faker->randomElement([
                        OrderStatus::PLACED,
                        OrderStatus::CONFIRMED,
                        OrderStatus::GRADED,
                        OrderStatus::REVIEWED,
                    ]),
                    'created_at' => $this->faker->dateTimeBetween('-2 month', 'now'),
                    'updated_at' => $this->faker->dateTimeBetween('-2 month', 'now'),
                    'payment_status' => $this->faker->randomElement([0,1]),
                ];
            }
        ));
});

it('calculates daily unpaid orders stats', function () {
    $getRandomOrder = $this->orders->random()->first();

    $orders = Order::where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value)
        ->forDate($getRandomOrder->created_at->toDateString())
        ->sum('grand_total');

    $unpaidDailyStats = $this->unpaidOrdersStatsService->calculateDailyStats($getRandomOrder->created_at->toDateString());

    expect($orders)->toBe($unpaidDailyStats['unpaidTotal']);
})->group('unpaid-orders-stats');

it('calculates monthly unpaid orders stats for the current month', function () {
    $getRandomOrder = $this->orders->random()->first();

    $orders = Order::where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value)
        ->forMonth($getRandomOrder->created_at->toDateString())
        ->sum('grand_total');

    $unpaidMonthlyStats = $this->unpaidOrdersStatsService->calculateMonthlyStats($getRandomOrder->created_at->toDateString());

    expect($orders)->toBe($unpaidMonthlyStats['unpaidTotal']);
})->group('unpaid-orders-stats');
