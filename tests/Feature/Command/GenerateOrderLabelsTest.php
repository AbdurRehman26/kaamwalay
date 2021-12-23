<?php

use App\Models\Order;

it('generates missing order labels for already graded orders', function () {

    $order = Order::factory()->create();

    $this->artisan('orderLabels:generate ' . $order->order_number)
        ->assertExitCode(0);

    $this->artisan('orderLabels:generate ')
        ->assertExitCode(0);
});
