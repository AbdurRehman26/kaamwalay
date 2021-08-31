<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

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
