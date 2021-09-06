<?php

use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\OrderItemCustomerShipmentSeeder;
use Database\Seeders\OrderItemSeeder;
use Database\Seeders\OrderItemShipmentSeeder;
use Database\Seeders\OrderSeeder;
use App\Models\User;
use Database\Seeders\RolesSeeder;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
        CardSeriesSeeder::class,
        CardSetsSeeder::class,
        CardProductSeeder::class,
    ]);
    $orders = \App\Models\Order::factory()->count(5)->create([
        'order_status_id' => 2,
    ]);
    \App\Models\OrderItem::factory()->count(2)->create([
        'order_id' => $orders[0],
    ]);
    $user = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->actingAs($user);
});

it('returns orders list for admin', function () {
    $response = $this->getJson('/api/admin/orders');
    $response->assertOk();
    $response->assertJsonStructure([
        'data' => [
            [
                'id',
                'order_number',
                'arrived',
                'status',
                'created_at',
            ],
        ],
    ]);
})->group('admin', 'admin_orders');

it('returns order details', function () {
    $response = $this->getJson('api/admin/orders/1');

    $response->assertOk();
    $response->assertJsonStructure([
        'data' => [
            'id',
            'order_number',
            'status',
            'created_at',
            'payment_method',
            'customer',
            'order_items',
        ],
    ]);
})->group('admin', 'admin_orders');
