<?php

use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Admin\V2\OrderStatusHistoryService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
    Event::fake();

    $user = User::factory()->create([
            'email' => 'test@gmail.com',
    ]);

    $orders = Order::factory()->count(1)->withPayment()->state(new Sequence(
        [
            'user_id' => $user->id,
            'order_status_id' => OrderStatus::PLACED,
        ],
    ))->create();

    $orders->each(function (Order $order) {
        $order->markAsPaid();
    });

    $this->orderStatusHistoryService = resolve(OrderStatusHistoryService::class);

    $orders->each(function ($order) {
        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::SHIPPED, $order->id, $order->user_id);
    });

    Config::set('mail.admin_addresses', [
        'test@gmail.com',
    ]);
});

it('sends monthly and quarterly emails', function () {
    $knownDate = Carbon::create(2023);
    Carbon::setTestNow($knownDate);

    $this->artisan('reports:send-email')
        ->assertExitCode(0);
});
