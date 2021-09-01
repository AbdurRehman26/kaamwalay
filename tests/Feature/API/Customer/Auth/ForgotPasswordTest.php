<?php

use App\Models\User;
use Illuminate\Support\Facades\Notification;

test('user can request forgot password', function () {
    $user = User::factory()->create();
    Notification::fake();

    $response = $this->postJson('/api/auth/password/forgot', [
        'email' => $user->email,
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('password_resets', [
        'email' => $user->email,
    ]);
})->group('auth');
