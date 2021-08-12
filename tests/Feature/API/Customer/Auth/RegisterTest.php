<?php

namespace Tests\Feature\API\Customer\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesSeeder::class);
        Event::fake();
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
            'phone' => '',
        ]);

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
        $response->assertJsonStructure([
            'errors' => ['username'],
        ]);
    }

    /**
     * @test
     *
     * @group auth
     */
    public function user_registration_triggers_registered_event()
    {
        $email = $this->faker->safeEmail();
        $this->postJson('/api/auth/register', [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $email,
            'username' => $this->faker->userName(),
            'password' => 'password',
            'password_confirmation' => 'password',
            'phone' => '',
        ]);

        Event::assertDispatched(CustomerRegistered::class);
    }

    /** @test */
    public function a_logged_in_customer_cannot_register()
    {
        /** @var User $user */
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson('api/auth/register');
        $response->assertRedirect();
    }
}
