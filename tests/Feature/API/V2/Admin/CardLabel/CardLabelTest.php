<?php

use App\Models\CardLabel;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Models\UserCard;
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
    $user = User::factory()->withRole(config('permission.roles.admin'))->create();

    $this->customer = User::factory()->withRole(config('permission.roles.customer'))->create();

    $this->order = Order::factory()->create([
        'order_status_id' => OrderStatus::GRADED,
    ]);

    OrderStatusHistory::factory()->create(
        ['order_status_id' => $this->order->order_status_id, 'order_id' => $this->order->id, 'user_id' => $this->order->user_id],
    );

    $orderItems = OrderItem::factory()->count(2)
        ->state(new Sequence(
            [
                'order_id' => $this->order->id,
                'order_item_status_id' => OrderItemStatus::GRADED,
            ],
            [
                'order_id' => $this->order->id,
                'order_item_status_id' => OrderItemStatus::GRADED,
            ]
        ))
        ->create();

    UserCard::factory()->count(2)->state(new Sequence(
        [
            'order_item_id' => $orderItems[0]->id,
            'certificate_number' => '000000100',
        ],
        [
            'order_item_id' => $orderItems[1]->id,
            'certificate_number' => '000000101',
        ]
    ))->create();

    $this->cardLabel = CardLabel::factory()->create();

    $this->orderLabels = CardLabel::factory()->count(2)->state(new Sequence(
        [
            'card_product_id' => $orderItems[0]->card_product_id,
        ],
        [
            'card_product_id' => $orderItems[1]->card_product_id,
        ]
    ))->create();

    $this->actingAs($user);
});

test('an admin can get card label details', function () {
    $this->getJson('/api/v2/admin/cards/'.$this->cardLabel->card_product_id.'/label')
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'card_label_id',
                'line_one',
                'line_two',
                'line_three',
                'line_four',
                'card_product',
            ],
        ]);
});

test('customers can not get card labels data', function () {
    $this->actingAs($this->customer);
    $this->getJson('/api/v2/admin/cards/'.$this->cardLabel->card_product_id.'/label')
        ->assertForbidden();
});

test('an admin can update card label details', function () {
    $this->putJson('/api/v2/admin/cards/labels/'.$this->cardLabel->id, [
        'line_one' => '2022 Lorem',
        'line_two' => 'Lorem Ipsum',
        'line_three' => 'Dolor',
        'line_four' => '#123',
    ])
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'card_label_id',
                'line_one',
                'line_two',
                'line_three',
                'line_four',
                'card_product',
            ],
        ])->assertJsonFragment([
            'line_one' => '2022 Lorem',
            'line_two' => 'Lorem Ipsum',
            'line_three' => 'Dolor',
            'line_four' => '#123',
        ]);
});

test('customers can not update card labels data', function () {
    $this->actingAs($this->customer);
    $this->putJson('/api/v2/admin/cards/labels/'.$this->cardLabel->id, [
        'line_one' => '2022 Lorem',
        'line_two' => 'Lorem Ipsum',
        'line_three' => 'Dolor',
        'line_four' => '#123',
    ])
        ->assertForbidden();
});

test('an admin can get order labels details', function () {
    $this->getJson('/api/v2/admin/orders/'.$this->order->id.'/labels')
        ->assertOk()
        ->assertJsonStructure([
            'data' => [[
                'card_product_id',
                'card_label_id',
                'certificate_number',
                'grade',
                'nick_name',
                'line_one',
                'line_two',
                'line_three',
                'line_four',
                'card_product',
            ]],
        ])->assertJsonCount(2, ['data']);
});

test('customers can not get order labels data', function () {
    $this->actingAs($this->customer);
    $this->getJson('/api/v2/admin/orders/'.$this->order->id.'/labels')
        ->assertForbidden();
});

test('an admin can export and update order label details', function () {
    Storage::fake('s3');
    $this->putJson('/api/v2/admin/orders/'.$this->order->id.'/labels', [
        'data' => [
            [
                'certificate_number' => '000000100',
                'line_one' => '2022 Lorem',
                'line_two' => 'Lorem Ipsum',
                'line_three' => 'Dolor',
                'line_four' => '#123',
                'persist_changes' => true,
            ],
            [
                'certificate_number' => '000000101',
                'line_one' => '2022 Lorem',
                'line_two' => 'Lorem Ipsum',
                'line_three' => 'Dolor',
                'line_four' => '#123',
                'persist_changes' => false,
            ],
        ],
    ])
        ->assertOk()
        ->assertJsonStructure([
            'message',
            'url',
        ]);

    $persistedLabel = CardLabel::find($this->orderLabels[0]->id);
    $notPersistedLabel = CardLabel::find($this->orderLabels[1]->id);
    expect($persistedLabel->line_one)->toBe('2022 Lorem');
    expect($notPersistedLabel->line_one)->toBe($this->orderLabels[1]->line_one);
});

test('customers can not update order labels data', function () {
    $this->actingAs($this->customer);
    $this->putJson('/api/v2/admin/orders/'.$this->order->id.'/labels', [
        'data' => [
            [
                'certificate_number' => '000000100',
                'line_one' => '2022 Lorem',
                'line_two' => 'Lorem Ipsum',
                'line_three' => 'Dolor',
                'line_four' => '#123',
                'persist_changes' => true,
            ],
        ],
    ])
        ->assertForbidden();
});
