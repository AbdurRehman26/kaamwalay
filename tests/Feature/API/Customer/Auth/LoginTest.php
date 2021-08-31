<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

test('user can login with valid credentials', function () {
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

/**
 *
 *
 * @return void
 */
test('user can not login with invalid email', function () {
    $response = $this->postJson('api/auth/login', [
        'email' => 'test@test.test',
        'password' => 'password',
    ]);

    $response->assertStatus(401);
    $response->assertJsonStructure([ 'error' ]);
    $response->assertJsonPath('error', 'The email or password is invalid.');
})->group('auth');

/**
 *
 *
 * @return void
 */
test('user can not login with invalid password', function () {
    $user = User::factory()->create();

    $response = $this->postJson('api/auth/login', [
        'email' => $user->email,
        'password' => 'passWord12',
    ]);

    $response->assertStatus(401);
    $response->assertJsonStructure([ 'error' ]);
    $response->assertJsonPath('error', 'The email or password is invalid.');
})->group('auth');

test('user receives his own information', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    $response = $this->getJson('api/auth/me');
    $response->assertStatus(200);
    $response->assertJsonStructure(['data' => ['user']]);
    $response->assertJsonPath('data.user.email', $user->email);
    $response->assertJsonPath('data.user.id', $user->id);
})->group('auth');

test('ags user can login', function () {
    Config::set('services.ags.is_platform_enabled', true);
    Config::set('services.ags.base_url', 'http://test.test');

    $testEmail = 'test@test.test';
    Http::fake([
        config('services.ags.base_url') . '/login/' => Http::response([
            'access_token' => 'token',
            'user' => [
                'username' => 'test',
                'email' => $testEmail,
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
})->group('auth');

test('a logged in customer cannot login', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->postJson('api/auth/login');
    $response->assertRedirect();
});
