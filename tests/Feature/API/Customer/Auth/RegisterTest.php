<?php

namespace Tests\Feature\API\Customer\Auth;

use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesSeeder::class);
    }

    /**
     * @test
     *
     * @group auth
     */
    public function user_can_register_as_customer()
    {
        $email = $this->faker->safeEmail();
        $response = $this->postJson('/api/auth/register', [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $email,
            'username' => $this->faker->userName(),
            'password' => 'password',
            'password_confirmation' => 'password',
            'phone' => '',
        ]);

        $response->assertStatus(Response::HTTP_CREATED);
        $response->assertJsonStructure([
            'access_token', 'type', 'expiry',
        ]);
    }

    /**
     * @test
     *
     * @group auth
     */
    public function user_can_not_register_with_duplicate_email()
    {
        $existingUser = User::factory()->create();
        $response = $this->postJson('/api/auth/register', [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $existingUser->email,
            'username' => $this->faker->userName(),
            'password' => 'password',
            'phone' => '',
        ]);

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
        $response->assertJsonStructure([
            'errors' => ['email'],
        ]);
    }

    /**
     * @test
     *
     * @group auth
     */
    public function user_can_not_register_with_duplicate_username()
    {
        $existingUser = User::factory()->create();
        $response = $this->postJson('/api/auth/register', [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->safeEmail(),
            'username' => $existingUser->username,
            'password' => 'password',
            'password_confirmation' => 'password',
            'phone' => '',
        ]);

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
        $response->assertJsonStructure([
            'errors' => ['username'],
        ]);
    }
}
