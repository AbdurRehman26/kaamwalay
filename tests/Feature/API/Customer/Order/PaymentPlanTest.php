<?php

namespace Tests\Feature\API\Customer\Order;

use App\Models\PaymentPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentPlanTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    /** @test */
    public function a_user_can_see_payment_plans()
    {
        $this->actingAs($this->user);

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

    /** @test */
    public function a_user_can_see_specific_payment_plan()
    {
        $this->actingAs($this->user);

        PaymentPlan::factory()
            ->count(1)
            ->create();
        $response = $this->getJson('/api/customer/orders/payment-plans/1');

        $response->assertJsonCount(4, 'data');
        $response->assertJsonStructure([
            'data' => ['id', 'price', 'max_protection_amount', 'turnaround'],
        ]);
    }

    /** @test */
    public function a_guest_cannot_get_payment_plans()
    {
        $response = $this->getJson('/api/customer/orders/payment-plans');

        $response->assertUnauthorized();
    }
}
