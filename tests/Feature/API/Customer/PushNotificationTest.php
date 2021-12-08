<?php

use App\Models\User;

use function Pest\Laravel\getJson;

test('a customer can get Pusher auth token', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = getJson('api/customer/push-notifications/auth');

    expect($response)->isOk();
    expect($response)->assertJsonStructure(['token']);
})->group('push-notification');

test('a guest cannot get Pusher auth token', function () {
    $response = getJson('api/customer/push-notifications/auth');

    expect($response)->assertUnauthorized();
})->group('push-notification');
