<?php

namespace Tests\Feature\API\Customer\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @test
     *
     * @group auth
     *
     * @return void
     */
    public function user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create();

        $response = $this->postJson('api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'token',
                'user',
            ]
        ]);
        $response->assertJsonPath('data.user.email', $user->email);
    }

    /**
     * @test
     *
     * @group auth
     *
     * @return void
     */
    public function user_can_not_login_with_invalid_email(): void
    {
        $response = $this->postJson('api/login', [
            'email' => 'test@test.test',
            'password' => 'password',
        ]);

        $response->assertStatus(401);
        $response->assertJsonStructure([ 'error' ]);
        $response->assertJsonPath('error', 'Unauthorized');
    }

    /**
     * @test
     *
     * @group auth
     *
     * @return void
     */
    public function user_can_not_login_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('api/login', [
            'email' => $user->email,
            'password' => 'password1',
        ]);

        $response->assertStatus(401);
        $response->assertJsonStructure([ 'error' ]);
        $response->assertJsonPath('error', 'Unauthorized');
    }
}
