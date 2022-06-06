<?php

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Events\API\Order\V1\OrderStatusChangedEvent;
use App\Models\Order;
use App\Models\OrderCustomerShipment;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
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
            'order_status_id' => 2,
            'user_id' => $user->id,
        ];
    })->toArray();

    OrderStatusHistory::insert($orderStatusHistoryData);
});

it('calculates daily unpaid orders stats', function () {
    $orders = Order::placed()->whereHas('orderCustomerShipment')->where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value);
    $randomOrder = $orders->inRandomOrder()->first();

    $expectedUnpaidTotal = $orders->forDate($randomOrder->created_at->toDateString())->sum('grand_total');

    $unpaidDailyStats = $this->unpaidOrdersStatsService->calculateDailyStats($randomOrder->created_at->toDateString());

    expect($unpaidDailyStats['unpaid_total'])->toBeGreaterThan(0)
        ->and($expectedUnpaidTotal)->toBe($unpaidDailyStats['unpaid_total']);
})->group('unpaid-orders-stats');

it('calculates monthly unpaid orders stats for the current month', function () {
    $orders = Order::placed()->whereHas('orderCustomerShipment')->where('payment_status', '!=', OrderPaymentStatusEnum::PAID->value);
    $randomOrder = $orders->inRandomOrder()->first();

    $expectedUnpaidTotal = $orders->forMonth($randomOrder->created_at->toDateString())->sum('grand_total');

    $unpaidMonthlyStats = $this->unpaidOrdersStatsService->calculateMonthlyStats($randomOrder->created_at->toDateString());

    expect($unpaidMonthlyStats['unpaid_total'])->toBeGreaterThan(0)
        ->and($expectedUnpaidTotal)->toBe($unpaidMonthlyStats['unpaid_total']);
})->group('unpaid-orders-stats');
