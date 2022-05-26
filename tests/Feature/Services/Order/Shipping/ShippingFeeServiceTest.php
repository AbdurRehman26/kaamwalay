<?php

use App\Models\Country;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\Order\Shipping\ShippingFeeService;

test('shipping fee is calculated correctly', function () {
    /** @var Order $order */
    $order = Order::factory()->insuredShipping()->create();

    $country = Country::factory()->create(['code' => 'US']);
    $customerAddress = CustomerAddress::factory()->for($order->user)->for($country)->create();

    $order->shippingAddress()->associate($customerAddress);

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

    expect(ShippingFeeService::calculateForOrder($order))->toEqual(172);
});
