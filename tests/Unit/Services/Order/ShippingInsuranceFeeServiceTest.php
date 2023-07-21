<?php

use App\Services\ShippingInsuranceFee\ShippingInsuranceFeeService;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Sequence;

beforeEach(function () {

    $this->order = Order::factory()->create();
    OrderItem::factory()->count(4)->state(new Sequence(
        [
            'declared_value_total' => 10,
            'order_id' => $this->order->id,
        ],
        [
            'declared_value_total' => 15,
            'order_id' => $this->order->id,
        ],
        [
            'declared_value_total' => 20,
            'order_id' => $this->order->id,
        ],
        [
            'declared_value_total' => 25,
            'order_id' => $this->order->id,
        ]
    ))->create();
});

it('should calculate proper shipping insurance for an order based on configurable percentage', function (int $shippingFeePercentage, float $expectedResult) {
    config(['robograding.feature_order_insurance_shipping_fee_percentage' => $shippingFeePercentage]);

    $service = new ShippingInsuranceFeeService($this->order);
    expect($service->calculate())->toBe($expectedResult);
})->with([
    [1, 0.7],
    [2, 1.4],
    [3, 2.1],
    [4, 2.8],
    [5, 3.5],
]);
