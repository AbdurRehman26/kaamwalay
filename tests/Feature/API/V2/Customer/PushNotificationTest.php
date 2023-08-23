<?php

use App\Jobs\Auth\CreateUserDeviceJob;
use App\Models\User;

use function Pest\Laravel\getJson;

test('a customer can get Pusher auth token without platform', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = getJson('/api/v2/customer/push-notifications/auth');

    expect($response)->isOk();
    expect($response)->assertJsonStructure(['token']);
})->group('push-notification');

test('a guest cannot get Pusher auth token', function () {
    $response = getJson('/api/v2/customer/push-notifications/auth');

    expect($response)->assertUnauthorized();
})->group('push-notification');

test('a customer can get Pusher auth token with valid platform', function () {
    Bus::fake();
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = getJson('/api/v2/customer/push-notifications/auth?platform=android');

    Bus::assertDispatched(CreateUserDeviceJob::class);
    expect($response)->isOk();
    expect($response)->assertJsonStructure(['token']);
})->group('push-notification');

test('a customer cannot get Pusher auth token with invalid platform', function () {
    Bus::fake();
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = getJson('/api/v2/customer/push-notifications/auth?platform=foo');

    Bus::assertNotDispatched(CreateUserDeviceJob::class);
    expect($response)->assertUnprocessable()->assertInvalid([
        'platform' => 'The selected platform is invalid.',
    ]);
})->group('push-notification');
