<?php

namespace Tests\Feature\API\Customer\Address;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class CustomerAddressTest extends TestCase
{
    use RefreshDatabase;
    private User $user;
    private string $token;
    private array $headers;

    public function prepare()
    {
        $this->seed();
        $this->user = User::where('id', '!=', 1)->orderBy('id')->first();
        $this->token = JWTAuth::fromUser($this->user);
        $this->headers = [
            'Authorization' => "Bearer $this->token",
        ];
    }

    /** @test */
    public function test_user_can_receive_addresses()
    {
        $this->prepare();
        $response = $this->getJson('/api/customer/addresses', $this->headers);
        $response->assertJsonStructure([
            'data' => [['id', 'first_name', 'last_name', 'state']],
        ]);
    }

    /** @test */
    public function test_user_can_receive_single_address()
    {
        $this->prepare();
        $response = $this->getJson('/api/customer/addresses/1', $this->headers);
        $response->assertJsonStructure([
            'data' => ['id', 'first_name', 'last_name', 'state'],
        ]);
    }

    /** @test */
    public function test_user_can_not_receive_other_user_address()
    {
        $this->prepare();
        $response = $this->getJson('/api/customer/addresses/2', $this->headers);
        $response->assertStatus(403);
    }

    /** @test */
    public function test_user_can_not_access_api_without_auth_token()
    {
        $this->prepare();
        $response = $this->getJson('/api/customer/addresses/2');
        $response->assertStatus(401);
    }
}
