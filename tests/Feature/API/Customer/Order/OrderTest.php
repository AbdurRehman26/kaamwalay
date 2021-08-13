<?php

namespace Tests\Feature\API\Customer\Order;

use App\Models\CardProduct;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;
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
        $this->markTestIncomplete('Stripe actual call needs to be mocked.');

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

    /** @test */
    public function a_guest_cannot_see_order()
    {
        Order::factory()->for($this->user)->create();

        $response = $this->getJson('/api/customer/orders/1');

        $response->assertUnauthorized();
    }

    /** @test */
    public function a_customer_can_see_his_order()
    {
        $this->actingAs($this->user);
        $order = Order::factory()->for($this->user)->create();
        $response = $this->getJson('/api/customer/orders/' . $order->id);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => ['id', 'order_number', 'shipping_method'],
        ]);
    }

    /** @test */
    public function a_customer_only_see_own_orders()
    {
        $someOtherCustomer = User::factory()->create();
        Order::factory()->for($someOtherCustomer)->create();

        $this->actingAs($this->user);
        $response = $this->getJson('/api/customer/orders/');

        $response->assertOk();
        $response->assertJsonCount(0, ['data']);
    }

    /** @test */
    public function a_customer_can_filter_orders_by_order_number()
    {
        $this->actingAs($this->user);

        Order::factory()
            ->count(2)
            ->for($this->user)
            ->state(new Sequence(
                ['order_number' => 'RG000000001'],
                ['order_number' => 'RG000000002'],
            ))
            ->create();

        $response = $this->getJson('/api/customer/orders?filter[order_number]=RG000000001');

        dd($response->getContent());

        $response->assertOk();
        $response->assertJsonCount(1, ['data']);
    }

    /** @test */
    public function a_customer_cannot_see_order_by_another_customer()
    {
        $someOtherCustomer = User::factory()->create();
        $order = Order::factory()->for($someOtherCustomer)->create();

        $this->actingAs($this->user);
        $response = $this->getJson('/api/customer/orders/' . $order->id);

        $response->assertForbidden();
    }

    /** @test */
    public function a_guest_cannot_see_orders()
    {
        $response = $this->getJson('/api/customer/orders/');

        $response->assertUnauthorized();
    }
}
