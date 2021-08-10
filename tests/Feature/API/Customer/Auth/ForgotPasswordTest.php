<?php

namespace Tests\Feature\API\Customer\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ForgotPasswordTest extends TestCase
{
    use RefreshDatabase;

    /** @test @group auth */
    public function user_can_request_forgot_password()
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/auth/password/forgot', [
            'email' => $user->email
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('password_resets', [
            'email' => $user->email
        ]);
    }
}
