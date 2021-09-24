<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Database\Seeders\RolesSeeder;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);
    $this->order = Order::factory()->create();
    OrderItem::factory()->for($this->order)->create();
    $user = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->actingAs($user);
});

test('an admin can update order shipment', function () {
    $this->postJson('/api/admin/orders/' . $this->order->id . '/shipment', [
        'shipping_provider' => 'usps',
        'tracking_number' => '9400100000000000000000',
    ])
        ->assertSuccessful()
        ->assertJsonFragment([
            'shipping_provider' => 'usps',
            'tracking_number' => '9400100000000000000000',
        ])
        ->assertJsonStructure([
            'data' => [
                'shipping_provider',
                'tracking_number',
            ],
        ]);
});

test('a customer can not update order shipment', function () {
    $customerUser = User::factory()->withRole(config('permission.roles.customer'))->create();
    $this->actingAs($customerUser);

    $this->postJson('/api/admin/orders/' . $this->order->id . '/shipment', [
        'shipping_provider' => 'usps',
        'tracking_number' => '9400100000000000000000',
    ])
        ->assertForbidden();
});