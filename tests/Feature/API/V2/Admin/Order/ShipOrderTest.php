<?php

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Enums\UserCard\UserCardShippingStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\User;
use App\Models\UserCard;
use Database\Seeders\RolesSeeder;

use function Pest\Laravel\postJson;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);
    $this->order = Order::factory()->create();
    $orderItem = OrderItem::factory()->for($this->order)->create();
    $this->userCard = UserCard::factory()->for($orderItem)->create();
    $user = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->actingAs($user);
});

test('an admin can ship order when shipping method is insured', function () {
    Event::fake();

    $this->order->update([
        'payment_status' => OrderPaymentStatusEnum::PAID,
        'shipping_method_id' => 1,
    ]);

    postJson('/api/v2/admin/orders/' . $this->order->id . '/shipment', [
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
                'order_shipment' => [
                    'shipping_provider',
                    'tracking_number',
                ],
            ],
        ]);

    expect($this->order->refresh()->order_status_id)->toBe(OrderStatus::SHIPPED);
});

test('an admin can ship order when shipping method is vault', function () {
    Event::fake();

    $this->order->update([
        'payment_status' => OrderPaymentStatusEnum::PAID,
        'shipping_method_id' => \App\Models\ShippingMethod::factory()->create([
            'code' => 'vault_storage',
        ])->id,
    ]);

    postJson('/api/v2/admin/orders/' . $this->order->id . '/shipment')->assertOk();

    expect($this->order->refresh()->orderShipment)->toBe(null);
    expect($this->userCard->refresh()->shipping_status)->toBe(UserCardShippingStatus::IN_VAULT);
    expect($this->order->refresh()->order_status_id)->toBe(OrderStatus::SHIPPED);
});

test('shipping details are required when order has insured shipping', function () {
    $this->order->update([
        'payment_status' => OrderPaymentStatusEnum::PAID,
        'shipping_method_id' => 1,
    ]);

    postJson('/api/v2/admin/orders/' . $this->order->id . '/shipment')
        ->assertUnprocessable();
});
