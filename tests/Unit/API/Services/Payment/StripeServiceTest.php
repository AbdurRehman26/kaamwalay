<?php

namespace Tests\Unit\API\Services\Payment;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\User;
use App\Services\Payment\Providers\PaymentProviderServiceInterface;
use App\Services\Payment\Providers\TestingStripeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class StripeServiceTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected PaymentProviderServiceInterface $stripe;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->stripe = new TestingStripeService;
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
    public function it_calculates_fee()
    {
        $order = Order::factory()->create();
        $totalAmount = (int) ($order->grand_total * 100);
        $actualFee = round((
            (TestingStripeService::STRIPE_FEE_PERCENTAGE * $totalAmount) + TestingStripeService::STRIPE_FEE_ADDITIONAL_AMOUNT
        ) / 100, 2);
        $calculatedFee = $this->stripe->calculateFee($order);
        $this->assertSame($calculatedFee, $actualFee);
    }
}
