<?php

namespace Tests\Feature\API\Customer\Order;

use Tests\TestCase;

class ShippingFeeTest extends TestCase
{
    /** @test */
    public function a_user_can_get_shipping_fee()
    {
        // @TODO Authenticate user and call on his behalf
        $response = $this->postJson('/api/customer/orders/shipping-fee/', [
            'items' => [
                [
                    'quantity' => 1,
                    'declared_value_per_unit' => 500,
                ],
                [
                    'quantity' => 2,
                    'declared_value_per_unit' => 1000,
                ],
            ],
        ]);

        $response->assertJsonStructure([
            'data' => ['shipping_fee'],
        ]);
    }

    /** @test */
    public function shipping_fee_needs_items()
    {
        // @TODO Authenticate user and call on his behalf
        $response = $this->postJson('/api/customer/orders/shipping-fee/');

        $response->assertJsonValidationErrors([
            'items' => 'The items field is required.',
        ]);
    }

    /** @test */
    public function a_guest_cannot_get_shipping_fee()
    {
        $this->markTestSkipped();
    }
}
