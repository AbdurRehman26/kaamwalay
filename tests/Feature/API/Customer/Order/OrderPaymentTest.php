<?php

namespace Tests\Feature\API\Customer\Order;

use App\Models\CardProduct;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderPaymentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->paymentPlan = PaymentPlan::factory()->create();
        $this->cardProduct = CardProduct::factory()->create();
        $this->shippingMethod = ShippingMethod::factory()->create();
        $this->paymentMethod = PaymentMethod::factory()->create();
    }

    /** @test */
    public function a_customer_can_see_saved_card_on_summary()
    {
        $this->markTestIncomplete('Stripe actual call needs to be mocked.');

        /** @var User $user */
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson('/api/customer/orders/', [
            'payment_plan' => [
                'id' => $this->paymentPlan->id,
            ],
            'items' => [
                [
                    'card_product' => [
                        'id' => $this->cardProduct->id,
                    ],
                    'quantity' => 1,
                    'declared_value_per_unit' => 500,
                ],
                [
                    'card_product' => [
                        'id' => $this->cardProduct->id,
                    ],
                    'quantity' => 1,
                    'declared_value_per_unit' => 500,
                ],
            ],
            'shipping_address' => [
                'first_name' => 'First',
                'last_name' => 'Last',
                'address' => 'Test address',
                'city' => 'Test',
                'state' => 'AB',
                'zip' => '12345',
                'phone' => '1234567890',
                'flat' => '43',
                'save_for_later' => true,
            ],
            'billing_address' => [
                'first_name' => 'First',
                'last_name' => 'Last',
                'address' => 'Test address',
                'city' => 'Test',
                'state' => 'AB',
                'zip' => '12345',
                'phone' => '1234567890',
                'flat' => '43',
                'same_as_shipping' => true,
            ],
            'shipping_method' => [
                'id' => $this->shippingMethod->id,
            ],
            'payment_method' => [
                'id' => $this->paymentMethod->id,
            ],
            'payment_provider_reference' => [
                'id' => '123',
            ],
        ]);

        $response->assertJsonStructure([
            'data' => [
                'id',
                'order_number',
                'order_payment' => [
                    'card' => [
                        'brand', 'exp_month', 'exp_year', 'last_4',
                    ],
                ],
            ],
        ]);
    }
}
