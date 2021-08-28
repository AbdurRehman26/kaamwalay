<?php

namespace Tests\Feature\API\Customer\PaymentCard;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentCardTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    /**
     * @test
     * @group payment
     */
    public function user_can_receive_payment_cards()
    {
        $response = $this->get('api/customer/payment-cards');

        $response->assertOk();

        $response->assertJsonStructure([
            'data' => [
                [
                    'id',
                    'customer',
                    'card',
                    'type',
                ],
            ],
        ]);
    }

    /**
     * @test
     * @group payment
    */
    public function user_can_create_card_setup_intent()
    {
        $response = $this->post('api/customer/payment-cards/setup');

        $response->assertOk();

        $response->assertJsonStructure([
            'intent' => [
                'client_secret',
                'customer',
                'object',
            ],
        ]);
    }
}
