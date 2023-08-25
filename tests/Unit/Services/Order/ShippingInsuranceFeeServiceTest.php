<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Services\ShippingInsuranceFee\ShippingInsuranceFeeService;
use Illuminate\Database\Eloquent\Factories\Sequence;

it('should calculate shipping insurance fee for an order based on configurable percentage', function (int $shippingFeePercentage, float $expectedShippingInsuranceFee) {
    config(['robograding.feature_order_shipping_insurance_fee_percentage' => $shippingFeePercentage]);

    $order = Order::factory()->create();
    OrderItem::factory()->count(4)->state(new Sequence(
        [
            'declared_value_total' => 10,
            'order_id' => $order->id,
        ],
        [
            'declared_value_total' => 15,
            'order_id' => $order->id,
        ],
        [
            'declared_value_total' => 20,
            'order_id' => $order->id,
        ],
        [
            'declared_value_total' => 25,
            'order_id' => $order->id,
        ]
    ))->create();

    $service = new ShippingInsuranceFeeService($order);
    expect($service->calculate())->toBe($expectedShippingInsuranceFee);
})->with([
    [1, 0.7],
    [2, 1.4],
    [3, 2.1],
    [4, 2.8],
    [5, 3.5],
]);
