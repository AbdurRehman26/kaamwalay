<?php

use App\Events\API\Auth\CustomerRegistered;
use App\Jobs\Auth\CreateUserDeviceJob;
use App\Models\Referrer;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Event;
use Symfony\Component\HttpFoundation\Response;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed(RolesSeeder::class);
    Bus::fake();
    Event::fake();
});

test('customer can register without platform', function () {
    $email = $this->faker->safeEmail();
    $response = $this->postJson('/api/v3/auth/register', [
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
    $response = $this->postJson('/api/v3/auth/register', [
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

test('user registration dispatches events and jobs', function () {
    $email = $this->faker->safeEmail();
    $this->postJson('/api/v3/auth/register', [
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $email,
        'username' => $this->faker->userName(),
        'password' => 'passWord1',
        'password_confirmation' => 'password',
        'phone' => '',
    ]);

    Event::assertDispatched(CustomerRegistered::class);
    Bus::assertDispatched(CreateUserDeviceJob::class);
})->group('auth');

test('a logged in customer cannot register', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->postJson('/api/v3/auth/register');
    $response->assertRedirect();
})->group('auth');

test('customer can register with valid platform', function () {
    $email = $this->faker->safeEmail();
    $response = $this->postJson('/api/v3/auth/register', [
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $email,
        'username' => $this->faker->userName(),
        'password' => 'passWord1',
        'password_confirmation' => 'password',
        'phone' => '',
        'platform' => $this->faker()->randomElement(['web', 'ios', 'android']),
        'app_generated_id' => '12345',
    ]);

    $response->assertStatus(Response::HTTP_CREATED);
    $response->assertJsonStructure([
        'access_token', 'type', 'expiry',
    ]);
});

test('customer cannot register with invalid platform', function () {
    $email = $this->faker->safeEmail();
    $response = $this->postJson('/api/v3/auth/register', [
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $email,
        'username' => $this->faker->userName(),
        'password' => 'passWord1',
        'password_confirmation' => 'password',
        'phone' => '',
        'platform' => 'foo',
    ]);

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
    $response->assertJsonValidationErrors([
        'platform' => 'The selected platform is invalid.',
    ]);
});

test('customer can register and have wallet assigned', function () {
    $email = $this->faker->safeEmail();
    $this->postJson('/api/v3/auth/register', [
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $email,
        'username' => $this->faker->userName(),
        'password' => 'passWord1',
        'password_confirmation' => 'password',
        'phone' => '',
    ]);
    $user = User::whereEmail($email)->first();
    
    expect($user->wallet()->exists())->toBeTrue();
    expect($user->wallet->balance)->toBe(0.0);
})->group('auth');

test('customer username is auto generated', function () {
    $email = $this->faker->safeEmail();
    $this->postJson('/api/v3/auth/register', [
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $email,
        'password' => 'passWord1',
        'password_confirmation' => 'password',
        'phone' => '',
    ]);
    $user = User::whereEmail($email)->first();

    expect($user->username)->not()->toBeEmpty();
})->group('auth');

test('a customer by default is opted in for marketing notifications on register ', function () {
    $email = $this->faker->safeEmail();
    $this->postJson('/api/v3/auth/register', [
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $email,
        'password' => 'passWord1',
        'password_confirmation' => 'password',
        'phone' => '',
    ]);
    $user = User::whereEmail($email)->first();

    expect($user->is_marketing_notifications_enabled)->toBeTrue();
})->group('auth');

test('a customer can opt out of marketing notifications during register ', function () {
    $email = $this->faker->safeEmail();
    $this->postJson('/api/v3/auth/register', [
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $email,
        'password' => 'passWord1',
        'password_confirmation' => 'password',
        'phone' => '',
        'is_marketing_notifications_enabled' => false,
    ]);
    $user = User::whereEmail($email)->first();

    expect($user->is_marketing_notifications_enabled)->toBeFalse();
})->group('auth');

test('customer can register with referral code and is marked as referee', function () {
    $referrer = Referrer::factory()->create();

    $email = $this->faker->safeEmail();
    $response = $this->postJson('/api/v3/auth/register', [
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $email,
        'username' => $this->faker->userName(),
        'password' => 'passWord1',
        'password_confirmation' => 'password',
        'phone' => '',
        'platform' => $this->faker()->randomElement(['web', 'ios', 'android']),
        'app_generated_id' => '12345',
        'referral_code' => $referrer->referral_code,
    ]);

    $response->assertStatus(Response::HTTP_CREATED);
    $response->assertJsonStructure([
        'access_token', 'type', 'expiry',
    ]);

    $user = User::whereEmail($email)->first();

    expect($user->referred_by)->toBe($referrer->user_id);
});

test('customer cannot register with incorrect referral code', function () {
    $email = $this->faker->safeEmail();
    $response = $this->postJson('/api/v3/auth/register', [
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $email,
        'username' => $this->faker->userName(),
        'password' => 'passWord1',
        'password_confirmation' => 'password',
        'phone' => '',
        'platform' => $this->faker()->randomElement(['web', 'ios', 'android']),
        'app_generated_id' => '12345',
        'referral_code' => 'Lorem Ipsum',
    ]);

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
    $response->assertJsonStructure([
        'errors' => ['referral_code'],
    ]);
});

it('throws error when trying to sign up using a referral code from inactive referrer', function () {
    $referrer = Referrer::factory()->create(['is_referral_active' => false]);

    $email = $this->faker->safeEmail();
    $response = $this->postJson('/api/v3/auth/register', [
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $email,
        'username' => $this->faker->userName(),
        'password' => 'passWord1',
        'password_confirmation' => 'password',
        'phone' => '',
        'platform' => $this->faker()->randomElement(['web', 'ios', 'android']),
        'app_generated_id' => $referrer->referral_code,
        'referral_code' => 'Lorem Ipsum',
    ]);

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
    $response->assertJsonStructure([
        'errors' => ['referral_code'],
    ]);
});