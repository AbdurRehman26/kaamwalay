<?php

namespace Tests\Feature\API\Customer\Order;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShippingMethodTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    /** @test */
    public function a_customer_can_get_shipping_methods()
    {
        $this->actingAs($this->user);
        $response = $this->getJson('/api/customer/orders/shipping-methods');

        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'code', 'name'],
            ],
        ]);
    }

    /** @test */
    public function a_customer_can_get_specific_shipping_method()
    {
        $this->actingAs($this->user);
        $response = $this->getJson('/api/customer/orders/shipping-methods/1');

        $response->assertJsonStructure([
            'data' => ['id', 'code', 'name'],
        ]);
    }

    /** @test */
    public function a_guest_cannot_get_shipping_methods()
    {
        $response = $this->getJson('/api/customer/orders/shipping-methods');

        $response->assertUnauthorized();
    }
}
