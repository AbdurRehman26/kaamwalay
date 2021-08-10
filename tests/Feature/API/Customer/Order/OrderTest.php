<?php

namespace Tests\Feature\API\Customer\Order;

use App\Models\CardProduct;
use App\Models\Country;
use App\Models\Order;
use App\Models\OrderStatus;
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
        $orders = Order::factory()->count(2)->create();
        $this->user = $orders->first()->user;
        $this->paymentPlan = PaymentPlan::factory()->create();
        $this->cardProduct = CardProduct::factory()->create();
        $this->shippingMethod = ShippingMethod::factory()->create();
        $this->paymentMethod = PaymentMethod::factory()->create();
        OrderStatus::factory()->create();
        Country::factory()->create();
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
                    'declared_value_per_unit' => 10000,
                ],
                [
                    'card_product' => [
                        'id' => $this->cardProduct->id,
                    ],
                    'quantity' => 1,
                    'declared_value_per_unit' => 10000,
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

    /** @test */
    public function a_guest_cannot_see_order()
    {
        $response = $this->getJson('/api/customer/orders/1');

        $response->assertUnauthorized();
    }

    /** @test */
    public function user_can_not_see_other_user_order()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/customer/orders/2');

        $response->assertStatus(403);
    }

    /** @test */
    public function user_can_see_his_order()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/customer/orders/1');
        $response->assertStatus(200);
        dd($response);
        $response->assertJsonStructure([
            'data' => ['id', 'order_number', 'shipping_method'],
        ]);
    }

}
