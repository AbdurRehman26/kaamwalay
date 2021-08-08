<?php

namespace Tests\Feature\API\Customer\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Artisan;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function setUp(): void
    {
        parent::setUp();
        Artisan::call('db:seed', ['--class' => 'RolesSeeder']);
    }

    /**
     * @test
     *
     * @group auth
     */
    public function user_can_register_as_customer(): void
    {
        $email = $this->faker->safeEmail();
        $response = $this->postJson('/api/register', [
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
            'data' => ['token', 'user'],
        ]);
        $response->assertJsonPath('data.user.email', $email);
        $response->assertJsonPath('data.user.roles.0.name', config('permission.roles.customer'));
    }

    /**
     * @test
     *
     * @group auth
     */
    public function user_can_register_as_customer_and_has_stripe_id(): void
    {
        $email = $this->faker->safeEmail();
        $response = $this->postJson('/api/register', [
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
            'data' => ['token', 'user'],
        ]);
        $response->assertJsonPath('data.user.email', $email);
        $response->assertJsonPath('data.user.roles.0.name', config('permission.roles.customer'));
        $data = json_decode($response->getContent());
        /**
         * @var User $user
        */
        $user = User::find($data->data->user->id);
        $this->assertTrue($user->hasStripeId());
    }

    /**
     * @test
     *
     * @group auth
     */
    public function user_can_not_register_with_duplicate_email(): void
    {
        $existingUser = User::factory()->create();
        $response = $this->postJson('/api/register', [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $existingUser->email,
            'username' => $this->faker->userName(),
            'password' => 'password',
            'password_confirmation' => 'password',
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
    public function user_can_not_register_with_duplicate_username(): void
    {
        $existingUser = User::factory()->create();
        $response = $this->postJson('/api/register', [
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

    public function tearDown(): void
    {
        parent::tearDown();
    }
}
