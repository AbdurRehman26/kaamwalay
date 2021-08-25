<?php

namespace Tests\Feature\API\Customer\Order\Payment;

use App\Exceptions\Services\Payment\PaymentNotVerified;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class StripeOrderPaymentTest extends TestCase
{
    use RefreshDatabase;

    protected $order;

    protected function setUp(): void
    {
        parent::setUp();
        $user = User::factory()->create([
            'stripe_id' => Str::random(25),
        ]);
        $this->order = Order::factory()->create([
            'user_id' => $user->id,
            'payment_method_id' => 1,
            'order_status_id' => 1,
        ]);
        $this->actingAs($user);
        Event::fake();
    }

    /**
     * @test
     * @group payment
     */
    public function user_can_be_charged_successfully()
    {
        OrderPayment::factory()->create([
            'order_id' => $this->order->id,
            'payment_method_id' => 1,
            'payment_provider_reference_id' => Str::random(25),
        ]);
        $response = $this->postJson("/api/customer/orders/{$this->order->id}/payments");

        $response->assertOk();
        $response->assertJsonStructure(['data' => ['id', 'charges']]);
        $response->assertJsonPath('data.amount', $this->order->grand_total_cents);
    }

    /**
     * @test
     * @group payment
     */
    public function user_receives_incomplete_payment_response()
    {
        OrderPayment::factory()->create([
            'order_id' => $this->order->id,
            'payment_method_id' => 1,
            'payment_provider_reference_id' => 'incomplete',
        ]);
        $response = $this->postJson("/api/customer/orders/{$this->order->id}/payments");

        $response->assertStatus(Response::HTTP_PAYMENT_REQUIRED);
        $response->assertJsonStructure(['payment_intent' => ['id']]);
    }

    /**
     * @test
     * @group payment
     */
    public function user_can_verify_a_successful_payment()
    {
        OrderPayment::factory()->create([
            'order_id' => $this->order->id,
            'payment_method_id' => 1,
            'payment_provider_reference_id' => Str::random(25),
        ]);
        $response = $this->postJson("/api/customer/orders/{$this->order->id}/payments/" . Str::random(25));
        $response->assertOk();
        $response->assertJson([
            'message' => 'Payment verified successfully',
        ]);
    }
    /**
     * @test
     * @group payment
     */
    public function user_cannot_verify_a_failed_payment()
    {
        OrderPayment::factory()->create([
            'order_id' => $this->order->id,
            'payment_method_id' => 1,
            'payment_provider_reference_id' => 'incomplete',
        ]);
        $response = $this->postJson("/api/customer/orders/{$this->order->id}/payments/incomplete");
        $exception = new PaymentNotVerified();
        $response->assertStatus($exception->getCode());
        $response->assertJson([
            'error' => $exception->getMessage(),
        ]);
    }
}
