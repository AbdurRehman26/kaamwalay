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

    Order::factory()->create([
        'order_status_id' => OrderStatus::SHIPPED,
    ]);

    OrderItem::factory()->count(3)->create([
        'order_item_status_id' => OrderItemStatus::GRADED,
        'order_id' => 1,
    ]);

    $this->userCards = UserCard::factory()->count(3)->sequence(
        [ 'order_item_id' => 1],
        [ 'order_item_id' => 2],
        [ 'order_item_id' => 3],
    )->create();

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
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
            'data' => [[
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
            ]],
        ]);
});
