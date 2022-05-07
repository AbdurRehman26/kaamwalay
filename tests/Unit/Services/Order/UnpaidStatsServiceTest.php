<?php

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Events\API\Order\V1\OrderStatusChangedEvent;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Order\UnpaidStatsService;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;

uses(WithFaker::class);

beforeEach(function () {
    Event::fake([
        OrderStatusChangedEvent::class,
    ]);
    $this->unpaidStatsService = resolve(UnpaidStatsService::class);

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

it('adds daily unpaid stats', function () {
    $getRandomOrder = $this->orders->random()->first();

    $orders = Order::where('payment_status', OrderPaymentStatusEnum::PENDING->value)
        ->orWhere('payment_status', OrderPaymentStatusEnum::DUE->value)
        ->forDate($getRandomOrder->created_at->toDateString())
        ->sum('grand_total');

    $unpaidDailyStats = $this->unpaidStatsService->addDailyUnpaidStats($getRandomOrder->created_at->toDateString());

    expect($orders)->toBe($unpaidDailyStats['unpaidTotal']);
})->group('unpaid-stats');

it('adds monthly unpaid stats for the current month', function () {
    $getRandomOrder = $this->orders->random()->first();

    $orders = Order::where('payment_status', OrderPaymentStatusEnum::PENDING->value)
        ->orWhere('payment_status', OrderPaymentStatusEnum::DUE->value)
        ->forMonth($getRandomOrder->created_at->toDateString())
        ->sum('grand_total');

    $unpaidMonthlyStats = $this->unpaidStatsService->addMonthlyUnpaidStats($getRandomOrder->created_at->toDateString());

    expect($orders)->toBe($unpaidMonthlyStats['unpaidTotal']);
})->group('unpaid-stats');
