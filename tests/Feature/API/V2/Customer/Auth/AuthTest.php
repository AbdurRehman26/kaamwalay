<?php


use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed(RolesSeeder::class);
    Bus::fake();
    Event::fake();
});

test('customer can register and login after', function () {
    $email = $this->faker->safeEmail();
    $response = $this->postJson('/api/v2/auth/register', [
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $email,
        'username' => $this->faker->userName(),
        'password' => 'passWord1',
        'password_confirmation' => 'password',
        'phone' => '',
    ]);

    $response->assertJsonStructure(['access_token', 'type', 'expiry']);


    $token = $response->json('access_token');
    $this->assertNotEmpty($token);

    auth()->logout();

    $response = $this->postJson('/api/v2/auth/login', [
        'email' => $email,
        'password' => 'passWord1',
    ]);

    $response->assertOk();
    $response->assertJsonStructure([
        'access_token',
        'type',
        'expiry',
    ]);

    $token = $response->json('access_token');
    $this->assertNotEmpty($token);

    $response = $this->getJson('/api/v2/auth/me', [
        'Authorization' => 'Bearer ' . $token,
    ]);

    $response->assertOk();
})->group('auth');
