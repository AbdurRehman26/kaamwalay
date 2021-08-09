<?php

namespace Tests\Feature\API\Customer\Address;

use App\Models\CustomerAddress;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerAddressTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    public function setUp(): void
    {
        parent::setUp();
        $addresses = CustomerAddress::factory()->count(2)->create();
        $this->user = $addresses->first()->user;
        $this->actingAs($this->user);
    }

    /** @test */
    public function user_can_receive_addresses()
    {
        $response = $this->getJson('/api/customer/addresses');
        $response->assertJsonStructure([
            'data' => [['id', 'first_name', 'last_name', 'state']],
        ]);
    }

    /** @test */
    public function user_can_receive_single_address()
    {
        $response = $this->getJson('/api/customer/addresses/1');
        $response->assertJsonStructure([
            'data' => ['id', 'first_name', 'last_name', 'state'],
        ]);
    }

    /** @test */
    public function user_can_not_receive_other_user_address()
    {
        $response = $this->getJson('/api/customer/addresses/2');
        $response->assertStatus(403);
    }
}
