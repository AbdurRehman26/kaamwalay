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

        $response = $this->postJson('api/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'access_token',
            'type',
            'expiry',
        ]);
    }

    /**
     * @test
     *
     * @group auth
     *
     * @return void
     */
    public function user_can_not_login_with_invalid_email()
    {
        $response = $this->postJson('api/auth/login', [
            'email' => 'test@test.test',
            'password' => 'password',
        ]);

        $response->assertStatus(401);
        $response->assertJsonStructure([ 'error' ]);
        $response->assertJsonPath('error', 'The email or password is invalid.');
    }

    /**
     * @test
     *
     * @group auth
     *
     * @return void
     */
    public function user_can_not_login_with_invalid_password()
    {
        $user = User::factory()->create();

        $response = $this->postJson('api/auth/login', [
            'email' => $user->email,
            'password' => 'password1',
        ]);

        $response->assertStatus(401);
        $response->assertJsonStructure([ 'error' ]);
        $response->assertJsonPath('error', 'The email or password is invalid.');
    }

    /**
     * @group auth
     * @test
    */
    public function user_receives_his_own_information()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->getJson('api/auth/me');
        $response->assertStatus(200);
        $response->assertJsonStructure(['data' => ['user']]);
        $response->assertJsonPath('data.user.email', $user->email);
        $response->assertJsonPath('data.user.id', $user->id);
    }

    /** @test */
    public function a_logged_in_customer_cannot_login()
    {
        /** @var User $user */
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson('api/auth/login');
        $response->assertRedirect();
    }
}
