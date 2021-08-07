<?php

namespace Tests\Feature\API\Customer\Order;

use App\Models\PaymentPlan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentPlanTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     * @return void
     */
    public function a_user_can_see_payment_plans()
    {
        // @TODO Authenticate user and call on his behalf
        PaymentPlan::factory()
            ->count(5)
            ->create();
        $response = $this->getJson('/api/customer/orders/payment-plans/');

        $response->assertJsonCount(5, 'data');
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'price', 'max_protection_amount', 'turnaround'],
            ],
        ]);
    }

    /**
     * @test
     * @return void
     */
    public function a_user_can_see_specific_payment_plan()
    {
        // @TODO Authenticate user and call on his behalf
        PaymentPlan::factory()
            ->count(1)
            ->create();
        $response = $this->getJson('/api/customer/orders/payment-plans/1');

        $response->assertJsonCount(4, 'data');
        $response->assertJsonStructure([
            'data' => ['id', 'price', 'max_protection_amount', 'turnaround'],
        ]);
    }
}
