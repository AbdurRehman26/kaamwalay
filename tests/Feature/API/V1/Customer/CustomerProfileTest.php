<?php

use App\Jobs\ProcessImage;
use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Bus;

uses(WithFaker::class);

beforeEach(function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([]),
    ]);

    $this->user = User::factory()->create();
    $this->anotherUser = User::factory()->create();
});

test('a customer can update his profile', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([]),
    ]);
    $this->actingAs($this->user);
    Bus::fake(ProcessImage::class);

    $response = $this->putJson('/api/v1/customer/profile', [
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
    Bus::assertDispatched(ProcessImage::class);
});

test('profile update does not dispatch Process Image job if no profile image', function () {
    Http::fake([
        // Faking AGS update user API
        'ags.api/users/me/' => Http::response([]),
    ]);
    $this->actingAs($this->user);
    Bus::fake(ProcessImage::class);

    $response = $this->putJson('/api/v2/customer/profile', [
        'first_name' => 'first',
    ]);

    $response->assertSuccessful();
    Bus::assertNotDispatched(ProcessImage::class);
});

test('customer profile update required fields error', function () {
    $this->actingAs($this->user);

    $this->actingAs($this->user);

    $response = $this->putJson('/api/v1/customer/profile', [
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

    $response = $this->putJson('/api/v1/customer/profile', [
        'username' => $this->anotherUser->username,
    ]);

    $response->assertUnprocessable();
});
