<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Services\Order\Shipping\ShippingFeeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

test('shipping fee is calculated correctly', function () {
    /** @var Order $order */
    $order = Order::factory()->create();

    OrderItem::factory()
        ->for($order)
        ->create([
            'declared_value_per_unit' => 8000,
            'declared_value_total' => 200000,
            'quantity' => 25,
        ]);
    OrderItem::factory()
        ->for($order)
        ->create([
            'declared_value_per_unit' => 25000,
            'declared_value_total' => 50000,
            'quantity' => 2,
        ]);

    $this->assertEquals(172, ShippingFeeService::calculateForOrder($order));
});
