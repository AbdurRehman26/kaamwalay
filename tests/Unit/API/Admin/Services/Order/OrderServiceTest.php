<?php

use App\Events\API\Admin\Order\ExtraChargeSuccessful;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Admin\OrderService;
use Illuminate\Foundation\Testing\WithFaker;
use App\Events\API\Admin\Order\RefundSuccessful;

uses(WithFaker::class);

beforeEach(function () {

    /* @var Order $order */
    $this->order = Order::factory()->create([
        'order_status_id' => OrderStatus::PLACED,
    ]);

    /* @var User $user */
    $this->user = User::factory()->create();

    /* @var OrderService $orderService */
    $this->orderService = resolve(OrderService::class);

    $this->amount = number_format($this->faker->randomFloat(2, 10, 30), 2);

    $this->paymentResponse = [
        'success' => true,
        'request' => [
            'amount' => (int) $this->amount * 100,
            'payment_intent_id' => \Illuminate\Support\Str::random(25),
            'additional_data' => [
                'description' => $this->faker->sentence(),
                'metadata' => [
                    'Order ID' => $this->order->id,
                    'User Email' => $this->order->user->email,
                    'Type' => 'Extra Charge',
                ],
            ],
        ],
        'response' => [],
        'payment_provider_reference_id' => \Illuminate\Support\Str::random(25),
        'amount' => $this->amount,
        'type' => OrderPayment::TYPE_EXTRA_CHARGE,
        'notes' => $this->faker->sentence(),
        'provider_fee' => 2.5,
    ];
});

it('can create extra charge for order', function () {
    Event::fake();

    $order = $this->order;
    $user = $this->user;
    $amount = $this->amount;

    $paymentResponse = $this->paymentResponse;

    $this->orderService->addExtraCharge($order, $user, [
        'notes' => $this->faker->sentence(),
        'amount' => $amount,
        'payment_method_id' => $order->payment_method_id,
        'type' => OrderPayment::TYPE_EXTRA_CHARGE,
    ], $paymentResponse);

    $orderPayment = $order->lastOrderPayment;

    expect($orderPayment->type)->toBe(OrderPayment::TYPE_EXTRA_CHARGE);
    expect($orderPayment->order_id)->toBe($order->id);
    expect($orderPayment->amount)->toEqual($amount);
    expect($orderPayment->user_id)->toEqual($user->id);
});

it('fires an event when extra charge is made', function () {
    Event::fake();

    $order = $this->order;

    $this->orderService->addExtraCharge($order, $this->user, [
        'notes' => $this->faker->sentence(),
        'amount' => $this->amount,
        'payment_method_id' => $order->payment_method_id,
        'type' => OrderPayment::TYPE_EXTRA_CHARGE,
    ], $this->paymentResponse);

    Event::assertDispatched(function (ExtraChargeSuccessful $event) use ($order) {
        return $event->order->id === $order->id && $event->order->lastOrderPayment->id === $order->lastOrderPayment->id;
    });
});

it('fires an event when refund is made', function () {
    Event::fake();

    $order = $this->order;

    $refundResponse = [
        'success' => true,
        'request' => [
            'amount' => (int) $this->amount * 100,
            'metadata' => [
                'Order ID' => $order->id,
                'Order #' => $order->order_number,
                'Notes' => $this->faker->sentence(),
            ],
        ],
        'response' => [],
        'payment_provider_reference_id' => Str::random(),
        'amount' => $this->amount,
        'type' => OrderPayment::TYPE_REFUND,
        'notes' => $this->faker->sentence(),
    ];

    $this->orderService->processRefund($order, $this->user, [
        'notes' => $this->faker->sentence(),
        'amount' => $this->amount,
        'payment_method_id' => $order->payment_method_id,
        'type' => OrderPayment::TYPE_REFUND,
    ], $refundResponse);

    Event::assertDispatched(function (RefundSuccessful $event) use ($order) {
        return $event->order->id === $order->id && $event->order->lastOrderPayment->id === $order->lastOrderPayment->id;
    });
});
