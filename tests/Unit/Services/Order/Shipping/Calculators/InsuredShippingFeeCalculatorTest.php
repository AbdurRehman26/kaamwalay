<?php

namespace Tests\Unit\Services\Order\Shipping\Calculators;

use App\Services\Order\Shipping\Calculators\InsuredShippingFeeCalculator;
use PHPUnit\Framework\TestCase;

class InsuredShippingFeeCalculatorTest extends TestCase
{
    /**
     * @test
     * @dataProvider insuredShippingFeeDataProvider
     */
    public function insured_shipping_fee_is_calculated_correctly(float $expectedShippingFee, float $calulcatedShippingFee)
    {
        $this->assertEquals($expectedShippingFee, $calulcatedShippingFee);
    }

    public function insuredShippingFeeDataProvider(): array
    {
        return [
            'Basic shipping fee case' => [
                14.00,
                InsuredShippingFeeCalculator::calculateShipping(200, 2),
            ],
            'Basic shipping fee case 2' => [
                151.00,
                InsuredShippingFeeCalculator::calculateShipping(155000, 10),
            ],
            'Basic shipping fee case 3' => [
                63.00,
                InsuredShippingFeeCalculator::calculateShipping(30000, 10),
            ],
            'Additional shipping fee case based on extra cards' => [
                20.50,
                InsuredShippingFeeCalculator::calculateShipping(200, 27),
            ],
            'Additional shipping fee case based on extra declared value' => [
                171.00,
                InsuredShippingFeeCalculator::calculateShipping(250000, 10),
            ],
            'Additional shipping fee case based on extra cards and declared value' => [
                172.00,
                InsuredShippingFeeCalculator::calculateShipping(250000, 27),
            ],
        ];
    }
}
