<?php

namespace Tests\Feature\API\Customer\Order;

use App\Models\CardProduct;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected PaymentPlan $paymentPlan;
    protected CardProduct $cardProduct;
    protected ShippingMethod $shippingMethod;
    protected PaymentMethod $paymentMethod;

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
    public function a_user_can_place_order()
    {
        $this->actingAs($this->user);

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
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'data' => ['id', 'order_number'],
        ]);
    }

    /** @test */
    public function an_order_needs_data()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/customer/orders/');

        $response->assertJsonValidationErrors([
            'payment_plan' => 'The payment plan field is required.',
            'items' => 'The items field is required.',
            'shipping_address' => 'The shipping address field is required.',
            'billing_address' => 'The billing address field is required.',
            'shipping_method' => 'The shipping method field is required.',
            'payment_method' => 'The payment method field is required.',
        ]);
    }

    /** @test */
    public function a_guest_cannot_place_order()
    {
        $response = $this->postJson('/api/customer/orders/');

        $response->assertUnauthorized();
    }
}
