<?php

use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;

test('user can login with valid credentials without platform', function () {
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
})->group('auth');

test('user can not login with invalid email', function () {
    Http::fake([
        'https://ags.api/login/' => Http::response([]),
    ]);
    $response = $this->postJson('api/auth/login', [
        'email' => 'test@test.test',
        'password' => 'password',
    ]);

    $response->assertStatus(401);
    $response->assertJsonStructure([ 'error' ]);
    $response->assertJsonPath('error', 'The email or password is invalid.');
})->group('auth');

test('user can not login with invalid password', function () {
    $user = User::factory()->create();
    Http::fake([
        'https://ags.api/login/' => Http::response([]),
    ]);

    $response = $this->postJson('api/auth/login', [
        'email' => $user->email,
        'password' => 'passWord12',
    ]);

    $response->assertStatus(401);
    $response->assertJsonStructure([ 'error' ]);
    $response->assertJsonPath('error', 'The email or password is invalid.');
})->group('auth');

test('user receives his own information', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $this->actingAs($user);
    $response = $this->getJson('api/auth/me');
    $response->assertStatus(200);
    $response->assertJsonStructure(['data' => ['user']]);
    $response->assertJsonPath('data.user.email', $user->email);
    $response->assertJsonPath('data.user.id', $user->id);
})->group('auth');

test('ags user can login', function () {
    $this->seed(RolesSeeder::class);
    Config::set('services.ags.is_platform_enabled', true);
    Config::set('services.ags.base_url', 'http://test.test');

    $testEmail = 'test@test.test';
    $firstName = 'firstname';
    $lastName = 'lastname';
    Http::fake([
        config('services.ags.base_url') . '/login/' => Http::response([
            'access_token' => 'token',
            'user' => [
                'username' => 'test',
                'email' => $testEmail,
                'first_name' => $firstName,
                'last_name' => $lastName,
            ],
        ], 200),
    ]);
    $response = $this->postJson('api/auth/login', [
        'email' => $testEmail,
        'password' => 'Asdasd1',
    ]);
    $user = User::first();
    $response->assertStatus(200);
    $response->assertJsonStructure(['access_token', 'type', 'expiry']);
    expect($user->email)->toBe($testEmail);
    expect($user->first_name)->toBe($firstName);
    expect($user->last_name)->toBe($lastName);
})->group('auth');

test('a logged in customer cannot login', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->postJson('api/auth/login');
    $response->assertRedirect();
})->group('auth');

test('user can login with valid platform', function () {
    $user = User::factory()->create();

    $response = $this->postJson('api/auth/login', [
        'email' => $user->email,
        'password' => 'password',
        'platform' => Arr::random(['web', 'ios', 'android']),
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'access_token',
        'type',
        'expiry',
    ]);
})->group('auth');

test('user cannot login with invalid platform', function () {
    $user = User::factory()->create();

    $response = $this->postJson('api/auth/login', [
        'email' => $user->email,
        'password' => 'password',
        'platform' => 'foo',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors([
        'platform' => 'The selected platform is invalid.',
    ]);
})->group('auth');

