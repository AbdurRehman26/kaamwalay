<?php

use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Support\Facades\Storage;

it('regenerates invoice for specified order', function () {
    Storage::fake('s3');
    $order = Order::factory()->create();
    Invoice::findOrFail($order->invoice_id)->delete();

    $order->refresh();
    expect($order->invoice)->toBeNull();

    $this->artisan('invoice:regenerate ' . $order->order_number)->assertExitCode(0);

    $order->refresh();
    expect($order->invoice)->toBeInstanceOf(Invoice::class);
});
