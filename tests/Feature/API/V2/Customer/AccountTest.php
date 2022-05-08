<?php

use App\Models\User;

test('Deactivate customer account', function () {
    Http::fake([
        'https://ags.api/users/me/' => Http::response([]),
    ]);

    $user = User::factory()->create();
    $this->actingAs($user);
    auth()->login($user);

    $me = $this->getJson('/api/v2/auth/me');
    $me->assertOk();
    $me->assertJsonFragment([
        'id' => $user->id,
    ]);

    $deactivate = $this->postJson('/api/v2/customer/account/deactivate');
    $deactivate->assertOk();
    $deactivate->assertJsonFragment([
        'success' => true,
    ]);

    // Re-login and retrieve a new session
    $this->actingAs($user);
    auth()->login($user);

    // This time we should get a 401
    $me = $this->getJson('/api/v2/auth/me');
    $me->assertUnauthorized();
});


test('Delete customer account', function () {
    Http::fake([
        'https://ags.api/users/me/' => Http::response([]),
    ]);

    $user = User::factory()->create();
    $this->actingAs($user);
    auth()->login($user);

    $me = $this->getJson('/api/v2/auth/me');
    $me->assertOk();
    $me->assertJsonFragment([
        'id' => $user->id,
    ]);

    $deactivate = $this->postJson('/api/v2/customer/account/delete');
    $deactivate->assertOk();
    $deactivate->assertJsonFragment([
        'success' => true,
    ]);

    // Re-login and retrieve a new session
    $this->actingAs($user);
    auth()->login($user);

    // This time we should get a 401
    $me = $this->getJson('/api/v2/auth/me');
    $me->assertUnauthorized();

    $userId = $user->id;
    $user = User::find($userId);
    $this->assertNull($user);

    $user = User::withTrashed()->find($userId);
    $this->assertNotNull($user);
    $this->assertTrue($user->trashed());
    $this->assertEmpty($user->first_name);
});
