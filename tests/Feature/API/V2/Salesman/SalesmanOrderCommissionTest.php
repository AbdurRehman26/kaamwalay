<?php

use App\Events\API\Admin\Order\RefundSuccessful;
use App\Events\API\Customer\Order\OrderPaid;
use App\Listeners\API\Admin\Order\RefundSuccessfulListener;
use App\Listeners\API\Order\V2\OrderPaidListener;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\User;
use App\Services\EmailService;
use App\Services\Order\V2\OrderService;
use App\Services\SalesmanCommission\SalesmanCommissionService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;

beforeEach(function () {
    Event::fake();
    Bus::fake();

    $this->user = User::factory()->withRole(config('permission.roles.customer'))->create([]);

    $this->paymentMethod = PaymentMethod::factory()->create([
        'code' => 'stripe',
    ]);

    $this->order = Order::factory()->create([
        'user_id' => $this->user->id,
        'coupon_id' => null,
        'payment_method_id' => $this->paymentMethod->id,
        'order_status_id' => OrderStatus::PLACED,
        'salesman_id' => User::factory()->withSalesman()
    ]);

    $this->actingAs($this->user);

});

it('adds commission to salesman when order is created', function () {

    $listener = new OrderPaidListener(new EmailService(), new OrderService());
    $listener->handle(new OrderPaid(Order::find($this->order->id)));

});

it('recalculates commission of salesman when order is refunded', function () {

    OrderPayment::factory()->create([
        'order_id' => $this->order->id,
        'payment_method_id' => $this->paymentMethod->id,
        'response' => json_encode(['id' => Str::random(25)]),
        'payment_provider_reference_id' => Str::random(25),
        'amount' => 10.00,
        'type' => OrderPayment::TYPE_REFUND,
        'created_at' => now()->addMinute(),
    ]);

    SalesmanCommissionService::onRefundOrder($this->order);

});
