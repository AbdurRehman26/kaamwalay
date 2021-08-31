<?php

use App\Events\API\Auth\CustomerRegistered;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);
uses(WithFaker::class);

beforeEach(function () {
    $this->seed(RolesSeeder::class);
    Event::fake();
});

test('user can register as customer', function () {
    $email = $this->faker->safeEmail();
    $response = $this->postJson('/api/auth/register', [
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $email,
        'username' => $this->faker->userName(),
        'password' => 'passWord1',
        'password_confirmation' => 'password',
        'phone' => '',
    ]);

    $response->assertStatus(Response::HTTP_CREATED);
    $response->assertJsonStructure([
        'access_token', 'type', 'expiry',
    ]);
})->group('auth');

test('user can not register with duplicate email', function () {
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
})->group('auth');

test('user can not register with duplicate username', function () {
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
})->group('auth');

test('user registration triggers registered event', function () {
    Event::fake();
    $email = $this->faker->safeEmail();
    $this->postJson('/api/auth/register', [
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $email,
        'username' => $this->faker->userName(),
        'password' => 'passWord1',
        'password_confirmation' => 'password',
        'phone' => '',
    ]);

    Event::assertDispatched(CustomerRegistered::class);
})->group('auth');

test('a logged in customer cannot register', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->postJson('api/auth/register');
    $response->assertRedirect();
});
