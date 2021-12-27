<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderItemStatusHistory;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Models\UserCard;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
        CardSeriesSeeder::class,
        CardSetsSeeder::class,
        CardProductSeeder::class,
    ]);

    $this->user = User::factory()->create();

    $this->orders = Order::factory()->count(1)->state(new Sequence(
        [
            'user_id' => $this->user->id,
            'order_status_id' => OrderStatus::SHIPPED,
        ],
    ))->create();

    OrderStatusHistory::factory()->count(1)->sequence(
        ['order_status_id' => $this->orders[0]->order_status_id, 'order_id' => $this->orders[0]->id, 'user_id' => $this->user->id],
    )->create();

    $items = OrderItem::factory()->count(3)
        ->state(new Sequence(
            [
                'order_id' => $this->orders[0]->id,
                'order_item_status_id' => OrderItemStatus::GRADED,
            ],
            [
                'order_id' => $this->orders[0]->id,
                'order_item_status_id' => OrderItemStatus::GRADED,
            ],
            [
                'order_id' => $this->orders[0]->id,
                'order_item_status_id' => OrderItemStatus::GRADED,
            ]
        ))
        ->create();


    OrderItemStatusHistory::factory()->count(3)->sequence(
        ['order_item_status_id' => $items[0]->order_item_status_id, 'order_item_id' => $items[0]->id, 'user_id' => $this->user->id, 'created_at' => '2021-10-07 10:00:00'],
        ['order_item_status_id' => $items[1]->order_item_status_id, 'order_item_id' => $items[1]->id, 'user_id' => $this->user->id, 'created_at' => '2021-10-07 10:00:05'],
        ['order_item_status_id' => $items[2]->order_item_status_id, 'order_item_id' => $items[2]->id, 'user_id' => $this->user->id, 'created_at' => '2021-10-07 10:00:10'],
    )->create();

    $this->userCards = UserCard::factory()->count(3)->sequence(
        ['order_item_id' => $items[0]->id, 'user_id' => $this->user->id],
        ['order_item_id' => $items[1]->id, 'user_id' => $this->user->id],
        ['order_item_id' => $items[2]->id, 'user_id' => $this->user->id],
    )->create();

    $this->actingAs($this->user);
});

test('customers can see their cards', function () {
    $response = $this->getJson('/api/v1/customer/cards');

    $response->assertStatus(200);
});

test('customers can see their card details', function () {
    $response = $this->getJson('/api/v1/customer/cards/' . $this->userCards[0]->id);

    $response->assertStatus(200);
});

test('a customer can not see details of a card owned by others', function () {
    $otherUser = User::factory()->create();
    $this->actingAs($otherUser);

    $response = $this->getJson('/api/v1/customer/cards/' . $this->userCards[0]->id);

    $response->assertForbidden();
});

it('sorts cards by date asc', function () {
    $response = $this->getJson('/api/v1/customer/cards?sort=date')
        ->assertOk();

    $this->assertEquals(
        OrderItemStatusHistory::orderBy('created_at')->first()->orderItem->card_product_id,
        $response->getData()->data[0]->card_product->id
    );

    $this->assertEquals(
        OrderItemStatusHistory::orderBy('created_at', 'desc')->first()->orderItem->card_product_id,
        $response->getData()->data[2]->card_product->id
    );
});

it('sorts cards by date desc', function () {
    $response = $this->getJson('/api/v1/customer/cards?sort=-date')
        ->assertOk();

    $this->assertEquals(
        OrderItemStatusHistory::orderBy('created_at', 'desc')->first()->orderItem->card_product_id,
        $response->getData()->data[0]->card_product->id
    );

    $this->assertEquals(
        OrderItemStatusHistory::orderBy('created_at')->first()->orderItem->card_product_id,
        $response->getData()->data[2]->card_product->id
    );
});

it('sorts cards alphabetically', function () {
    $response = $this->getJson('/api/v1/customer/cards?sort=name')
        ->assertOk();

    $this->assertEquals(
        OrderItem::join('card_products', 'card_products.id', '=', 'order_items.card_product_id')->orderBy('card_products.name')->first()->name,
        $response->getData()->data[0]->card_product->name
    );

    $this->assertEquals(
        OrderItem::join('card_products', 'card_products.id', '=', 'order_items.card_product_id')->orderBy('card_products.name', 'desc')->first()->name,
        $response->getData()->data[2]->card_product->name
    );
});

it('filters cards by name', function () {
    $searchName = $this->userCards[0]->orderItem->cardProduct->name;
    $this->getJson('/api/v1/customer/cards?filter[search]=' . $searchName)
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'name' => $searchName,
        ]);
});
