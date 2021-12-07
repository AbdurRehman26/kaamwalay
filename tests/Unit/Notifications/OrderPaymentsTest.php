<?php

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Admin\OrderService;
use Illuminate\Foundation\Testing\WithFaker;

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

    $this->refundResponse = [
        'success' => true,
        'request' => [
            'amount' => (int) $this->amount * 100,
            'metadata' => [
                'Order ID' => $this->order->id,
                'Order #' => $this->order->order_number,
                'Notes' => $this->faker->sentence(),
            ],
        ],
        'response' => [],
        'payment_provider_reference_id' => Str::random(),
        'amount' => $this->amount,
        'type' => OrderPayment::TYPE_REFUND,
        'notes' => $this->faker->sentence(),
    ];
});

it('sends notification when extra charge is made', function () {
    Event::fake();
    Notification::fake();
    $order = $this->order;

    $this->orderService->addExtraCharge($order, $this->user, [
        'notes' => $this->faker->sentence(),
        'amount' => $this->amount,
        'payment_method_id' => $order->payment_method_id,
        'type' => OrderPayment::TYPE_EXTRA_CHARGE,
    ], $this->paymentResponse);

    Notification::assertNotSentTo(
        [$order],
        AnotherNotification::class
    );
});
