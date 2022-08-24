<?php

use App\Models\Order;
use App\Models\OrderStatus;

use Illuminate\Database\Eloquent\Factories\Sequence;

use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    Storage::fake('s3');
});

it('generates order certificates export for specific order', function () {
    $order = Order::factory()->create(['order_status_id' => OrderStatus::GRADED]);

    $this->artisan('orders:generate-certificates-export ' . $order->order_number)->assertExitCode(0);
    assertDatabaseHas('order_certificates', ['order_id' => $order->id]);
});

it('generates order certificates export for already confirmed orders', function () {
    $orders = Order::factory()->count(4)->state(new Sequence(
        ['order_status_id' => OrderStatus::GRADED],
        ['order_status_id' => OrderStatus::CONFIRMED],
        ['order_status_id' => OrderStatus::ASSEMBLED],
        ['order_status_id' => OrderStatus::SHIPPED],
    ))->create();

    $this->artisan('orders:generate-certificates-export')->assertExitCode(0);
    assertDatabaseCount('order_certificates', $orders->count());
});
