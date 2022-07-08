<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Models\User;
use App\Models\UserCard;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $order = Order::factory()->create([
        'order_status_id' => OrderStatus::SHIPPED,
    ]);

    $orderItems = OrderItem::factory()->count(3)->create([
        'order_item_status_id' => OrderItemStatus::GRADED,
        'order_id' => $order->id,
    ]);

    $this->userCards = UserCard::factory()->count(3)->sequence(
        [ 'order_item_id' => $orderItems[0]->id, 'certificate_number' => '00000001'],
        [ 'order_item_id' => $orderItems[1]->id, 'certificate_number' => '00000002'],
        [ 'order_item_id' => $orderItems[2]->id, 'certificate_number' => '00000003S'],
    )->create();

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->customer = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create();

    $this->actingAs($this->user);
});

test('admins can get certificates list', function () {
    $response = $this->getJson('/api/v2/admin/certificates');

    $response->assertSuccessful();
    $response->assertJsonCount(3, ['data']);
});

test('admins can get single certificate', function () {
    $response = $this->getJson('/api/v2/admin/certificates/' . $this->userCards[0]->certificate_number);

    $response->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                'certificate_number',
                'grade',
                'nickname',
                'card_name',
                'category_name',
                'set_name',
                'set_cards_number',
                'series_name',
                'release_date',
                'release_year',
                'card_number_order',
                'image_path',
                'rarity',
                'language',
                'variant',
                'surface',
                'edition',
            ],
        ]);
});

test('a customer can not get certificates list', function () {
    $this->actingAs($this->customer);

    $response = $this->getJson('/api/v2/admin/certificates');

    $response->assertForbidden();
});

test('a customer can not get single certificate', function () {
    $this->actingAs($this->customer);

    $response = $this->getJson('/api/v2/admin/certificates' . $this->userCards[0]->certificate_number);

    $response->assertForbidden();
});
