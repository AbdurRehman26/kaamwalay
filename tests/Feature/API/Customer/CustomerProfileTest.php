<?php

use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->anotherUser = User::factory()->create();
});

test('a customer can update his profile', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/customer/profile', [
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
    $this->actingAs($this->user);

    $this->actingAs($this->user);

    $response = $this->putJson('/api/customer/profile', [
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
    $this->actingAs($this->user);

    $response = $this->putJson('/api/customer/profile', [
        'username' => $this->anotherUser->username,
    ]);

    $response->assertUnprocessable();
});
