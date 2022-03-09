<?php

namespace Tests\Feature\API\Admin\Auth;

use App\Exceptions\API\Auth\AuthenticationException;
use App\Models\User;
use Database\Seeders\RolesSeeder;

beforeEach(fn () => $this->seed(RolesSeeder::class));

test('admin can login', function () {
    $user = User::factory()->withRole(config('permission.roles.admin'))->create();

    $response = $this->postJson('/api/v2/admin/auth/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertOk();
    $response->assertJsonStructure([
        'access_token',
        'type',
        'expiry',
    ]);
})->group('auth');

test('customer can not login with admin route', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();

    $response = $this->postJson('/api/v2/admin/auth/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertUnauthorized();
    $response->assertJsonStructure([ 'error' ]);
    $response->assertJsonPath('error', (new AuthenticationException)->getMessage());
})->group('auth');

test('admin can not login with invalid password', function () {
    $user = User::factory()->withRole(config('permission.roles.admin'))->create();

    $response = $this->postJson('/api/v2/admin/auth/login', [
        'email' => $user->email,
        'password' => 'passWord12',
    ]);

    $response->assertUnauthorized();
    $response->assertJsonStructure([ 'error' ]);
    $response->assertJsonPath('error', (new AuthenticationException)->getMessage());
})->group('auth');
