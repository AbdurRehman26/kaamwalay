<?php

namespace Tests\Feature\API\Admin\Coupon;

use Tests\TestCase;

class ChangeCouponStatusTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_example()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
