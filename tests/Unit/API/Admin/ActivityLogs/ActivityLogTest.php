<?php

use App\Models\Order;
use App\Models\User;
use Database\Seeders\RolesSeeder;

beforeEach(function () {
    $this->seed(RolesSeeder::class);
    User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();
});

test('adds logs when order is created by admin', function () {
    $this->actingAs(User::find(1));
    Order::factory()->create();
    $this->assertDatabaseCount('activity_log', 1);
});

test('does`nt add logs when order is created by customer', function () {
    $user = User::factory()->withRole('customer')->create();
    $this->actingAs($user);
    Order::factory()->create();
    $this->assertDatabaseCount('activity_log', 0);
});

test('adds logs when order is updated by admin', function () {
    $this->actingAs(User::find(1));
    $order = Order::factory()->create();
    $order->reviewed_by_id = 1;
    $order->save();
    $this->assertDatabaseCount('activity_log', 2);
});

test('does`nt add logs when order is updated by customer', function () {
    $user = User::factory()->withRole('customer')->create();
    $this->actingAs($user);
    $order = Order::factory()->create();
    $order->reviewed_by_id = 1;
    $order->save();
    $this->assertDatabaseCount('activity_log', 0);
});
