<?php

use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->anotherUser = User::factory()->create();
});

test('a customer can update his profile', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([]),
    ]);
    $this->actingAs($this->user);

    $response = $this->putJson('/api/v2/customer/profile', [
            'first_name' => 'first',
            'last_name' => 'Last',
            'email_subscription' => true,
            'phone' => '1234567890',
            'username' => 'test24',
            'profile_image' => 'https://via.placeholder.com/150',
    ]);

    $response->assertSuccessful();
    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => [
            'id',
            'first_name',
            'last_name',
            'phone',
            'username',
            'email',
            'profile_image',
            'customer_number',
        ],
    ]);
});

test('customer profile update required fields error', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([]),
    ]);
    $this->actingAs($this->user);

    $response = $this->putJson('/api/v2/customer/profile', [
        'first_name' => '',
        'last_name' => '',
        'phone' => '',
        'username' => '',
        'profile_image' => '',
    ]);

    $response->assertInvalid([
        'first_name',
        'last_name',
        'username',
    ]);
});

test('a customer`s username can not be duplicate', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([]),
    ]);
    $this->actingAs($this->user);

    $response = $this->putJson('/api/v2/customer/profile', [
        'username' => $this->anotherUser->username,
    ]);

    $response->assertUnprocessable();
});

test('a customer can deactivate their account', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([]),
    ]);

    $this->actingAs($this->user);
    auth()->login($this->user);

    $response = $this->postJson('/api/v2/customer/profile/deactivate');
    $response->assertOk();
    $response->assertJsonFragment([
        'success' => true,
    ]);

    // Re-login and retrieve a new session
    $this->actingAs($this->user);
    auth()->login($this->user);

    // This time we should get a 401
    $me = $this->getJson('/api/v2/auth/me');
    $me->assertUnauthorized();
});


test('a customer can delete their account', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([
            "app_status" => 1,
            "app_message" => [
                "Removed successfully",
            ],
        ]),
    ]);

    $this->actingAs($this->user);
    auth()->login($this->user);

    $response = $this->postJson('/api/v2/customer/profile/delete');
    $response->assertOk();
    $response->assertJsonFragment([
        'success' => true,
    ]);

    // Re-login and retrieve a new session
    $this->actingAs($this->user);
    auth()->login($this->user);

    // This time we should get a 401
    $me = $this->getJson('/api/v2/auth/me');
    $me->assertUnauthorized();

    $user = User::withTrashed()->find($this->user->id);
    $this->assertNotNull($user);
    $this->assertTrue($user->trashed());
    $this->assertEmpty($user->first_name);
});

test('a customer cannot delete their account if ags fail', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([
            "app_status" => 0,
            "app_message" => [
                "Removed successfully",
            ],
        ]),
    ]);

    $this->actingAs($this->user);
    auth()->login($this->user);

    $response = $this->postJson('/api/v2/customer/profile/delete');
    $response->assertUnprocessable();

    // Re-login and retrieve a new session
    $this->actingAs($this->user);
    auth()->login($this->user);

    // This time we should get a 401
    $me = $this->getJson('/api/v2/auth/me');
    $me->assertOk();
});
