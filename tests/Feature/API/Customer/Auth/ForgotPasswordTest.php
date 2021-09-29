<?php

use App\Models\User;

test('user can request forgot password', function () {
    $user = User::factory()->create();
    $mandrillResponse = [[
        'email' => 'test@test.com',
        'status' => 'sent',
        '_id' => '7f1f03dfcf5243d5a213873d738a0bd7',
        'reject_reason' => null,
    ]];
    Http::fake([
        'https://mandrillapp.com/api/*' => Http::response($mandrillResponse),
    ]);

    $response = $this->postJson('/api/auth/password/forgot', [
        'email' => $user->email,
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('password_resets', [
        'email' => $user->email,
    ]);
})->group('auth');
