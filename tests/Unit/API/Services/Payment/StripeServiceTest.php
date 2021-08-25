<?php

namespace Tests\Unit\API\Services\Payment;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\User;
use App\Services\Payment\Providers\PaymentProviderServiceInterface;
use App\Services\Payment\Providers\StripeService;
use App\Services\Payment\Providers\TestingStripeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class StripeServiceTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected TestingStripeService $stripe;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->stripe = resolve(StripeService::class);
    }

    /**
     * @test
     * @group payment
     */
    public function it_can_generate_stripe_customer_id()
    {
        $user = User::factory()->create();
        $this->stripe->createCustomerIfNull($user);
        $user->refresh();
        $this->assertTrue($user->hasStripeId());
    }

    /**
     * @test
     * @group payment
     */
    public function is_successfully_validates_a_paid_order()
    {
        /** @var Order $order */
        $order = Order::factory()->create();
        OrderPayment::factory()->create([
            'order_id' => $order->id,
            'payment_method_id' => 1,
        ]);
        $result = $this->stripe->verify($order, Str::random(25));

        $this->assertTrue($result);
    }

    /**
     * @test
     * @group payment
     */
    public function is_successfully_invalidates_unpaid_order()
    {
        $order = Order::factory()->create();
        OrderPayment::factory()->create([
            'order_id' => $order->id,
            'payment_method_id' => 1,
        ]);
        $result = $this->stripe->verify($order, 'incomplete');

        $this->assertFalse($result);
    }

    /**
     * @test
     * @group payment
     */
    public function it_charges_user_successfully()
    {
        $order = Order::factory()->create();
        OrderPayment::factory()->create([
            'order_id' => $order->id,
            'payment_method_id' => 1,
            'payment_provider_reference_id' => Str::random(25),
        ]);
        $result = $this->stripe->charge($order);

        $this->assertArrayHasKey('success', $result);
    }

    /**
     * @test
     * @group payment
     */
    public function it_fails_to_charge_user()
    {
        $order = Order::factory()->create();
        OrderPayment::factory()->create([
            'order_id' => $order->id,
            'payment_method_id' => 1,
            'payment_provider_reference_id' => 'incomplete',
        ]);
        $result = $this->stripe->charge($order);

        $this->assertArrayHasKey('payment_intent', $result);
    }

    /**
     * @test
     * @group payment
     */
    public function it_returns_payment_cards_for_user()
    {
        $user = User::factory()->create();
        $result = $this->stripe->getUserPaymentMethods($user);

        $this->assertArrayHasKey(0, $result);
        $this->assertArrayHasKey('id', $result[0]);
        $this->assertArrayHasKey('customer', $result[0]);
    }

    /**
     * @test
     * @group payment
     */
    public function it_returns_payment_setup_intent_for_user()
    {
        $user = User::factory()->create();
        $result = $this->stripe->createSetupIntent($user);

        $this->assertArrayHasKey('client_secret', $result);
        $this->assertArrayHasKey('customer', $result);
    }
}
