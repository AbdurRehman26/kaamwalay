<?php

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Services\Admin\OrderService;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

test('it can create extra charge for order', function () {
    /* @var Order $order */
    $order = Order::factory()->create([
        'order_status_id' => OrderStatus::PLACED,
    ]);
    /* @var OrderService $orderService */
    $orderService = resolve(OrderService::class);

    $amount = number_format($this->faker->randomFloat(2, 10, 30), 2);
    $paymentResponse = [
        'success' => true,
        'request' => [
            'amount' => (int) $amount * 100,
            'payment_intent_id' => \Illuminate\Support\Str::random(25),
            'additional_data' => [
                'description' => $this->faker->sentence(),
                'metadata' => [
                    'Order ID' => $order->id,
                    'User Email' => $order->user->email,
                    'Type' => 'Extra Charge',
                ],
            ],
        ],
        'response' => [],
        'payment_provider_reference_id' => \Illuminate\Support\Str::random(25),
        'amount' => $amount,
        'type' => OrderPayment::TYPE_EXTRA_CHARGE,
        'notes' => $this->faker->sentence(),
        'provider_fee' => 2.5,
    ];
    $orderService->addExtraCharge($order, [
        'notes' => $this->faker->sentence(),
        'amount' => $amount,
        'payment_method_id' => $order->payment_method_id,
        'type' => OrderPayment::TYPE_EXTRA_CHARGE,
    ], $paymentResponse);

    $orderPayment = $order->lastOrderPayment;

    expect($orderPayment->type)->toBe(OrderPayment::TYPE_EXTRA_CHARGE);
    expect($orderPayment->order_id)->toBe($order->id);
    expect($orderPayment->amount)->toEqual($amount);
});
