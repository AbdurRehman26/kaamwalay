<?php

use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Admin\OrderService;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\OrderPayment;

uses(WithFaker::class);

test('it can create extra charge for order', function () {
    /* @var Order $order */
    $order = Order::factory()->create([
        'order_status_id' => OrderStatus::PLACED,
    ]);
    /* @var OrderService $orderService */
    $orderService = resolve(OrderService::class);

    $amount = number_format($this->faker->randomFloat(2, 10, 30), 2);
    $orderService->addExtraCharge($order, [
        'notes' => $this->faker->sentence(),
        'amount' => $amount,
        'payment_method_id' => $order->payment_method_id,
        'type' => OrderPayment::PAYMENT_TYPES['extra_charge'],
    ]);

    $orderPayment = $order->lastOrderPayment;

    expect($orderPayment->type)->toBe(OrderPayment::PAYMENT_TYPES['extra_charge']);
    expect($orderPayment->order_id)->toBe($order->id);
    expect($orderPayment->amount)->toEqual($amount);
});
