<?php

use App\Events\API\Customer\Order\OrderPaid;
use App\Listeners\API\Order\V2\OrderPaidListener;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\EmailService;
use App\Services\Order\V2\OrderService;
use Illuminate\Support\Facades\Event;

beforeEach(function () {
    Event::fake();
    Bus::fake();

    $this->order = Order::factory()->create([
        'user_id' => $this->user->id,
        'coupon_id' => null,
        'payment_method_id' => 1,
        'order_status_id' => OrderStatus::PLACED,
        'salesman_id' => User::factory()->withRole(config('permission.roles.salesman'))
    ]);

    $this->actingAs($this->user);

});

it('adds commission to salesman when order is created', function () {

    $listener = new OrderPaidListener(new EmailService(), new OrderService());
    $listener->handle(new OrderPaid(Order::find($this->order->id)));

})->group('order.wallet.credit');
