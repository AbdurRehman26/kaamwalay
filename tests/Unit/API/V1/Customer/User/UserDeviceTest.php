<?php

use App\Models\User;
use App\Models\UserDevice;

use function Pest\Laravel\assertDatabaseCount;

test('user device is created once with same platform', function () {
    $user = User::factory()->create();
    UserDevice::firstOrCreate([
        'user_id' => $user->id,
        'platform' => 'ios',
    ]);
    UserDevice::firstOrCreate([
        'user_id' => $user->id,
        'platform' => 'ios',
    ]);

    assertDatabaseCount('user_devices', 1);
});

test('multiple user devices are created with different platforms', function () {
    $user = User::factory()->create();
    UserDevice::firstOrCreate([
        'user_id' => $user->id,
        'platform' => 'ios',
    ]);
    UserDevice::firstOrCreate([
        'user_id' => $user->id,
        'platform' => 'android',
    ]);

    assertDatabaseCount('user_devices', 2);
});
