<?php

use App\Jobs\OrderLabel\CreateOrderLabel;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Support\Facades\Bus;

it('dispatches job for creating files for order labels when order is marked as graded', function () {
    Bus::fake();
    $order = Order::factory()->create();

    $this->postJson('/api/admin/orders/' . $order->id . '/status-history', [
        'order_status_id' => OrderStatus::GRADED,
    ]);
    CreateOrderLabel::dispatchSync($order);
    Bus::assertDispatched(CreateOrderLabel::class);
    
});