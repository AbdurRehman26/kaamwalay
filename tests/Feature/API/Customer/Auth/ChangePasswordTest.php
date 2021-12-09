<?php

use App\Models\User;

beforeEach(function () {
    Http::fake([
        // Faking AGS for password change and login API
        'ags.api/login/' => Http::response([]),
        'ags.api/password/change/' => Http::response([]),
    ]);
});

test('user can change password', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->postJson('/api/auth/password/change', [
        'current_password' => 'password',
        'password' => '123Robograding456',
        'password_confirmation' => '123Robograding456',
    ]);

    $response->assertStatus(201);
})->group('auth');

test('user is validated while changing password', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->postJson('/api/auth/password/change', [
        'current_password' => '1password',
        'password' => 'password',
        'password_confirmation' => '1password',
    ]);

    $response->assertStatus(422);

    $response->assertInvalid([
        'current_password',
        'password',
    ]);
})->group('auth');
