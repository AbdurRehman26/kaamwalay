<?php

use App\Events\API\Admin\OrderItem\OrderItemCardChangedEvent;
use App\Models\CardProduct;
use App\Models\OrderItem;
use App\Models\OrderItemStatusHistory;
use App\Models\OrderStatus;
use App\Models\User;
use App\Models\UserCard;
use App\Services\Admin\OrderService;
use App\Services\AGS\AgsService;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);
uses()->group('admin');

beforeEach(function () {
    $this->seed(RolesSeeder::class);

    $this->user = User::createAdmin([
        'first_name' => $this->faker->firstName,
        'last_name' => $this->faker->lastName,
        'email' => $this->faker->safeEmail,
        'username' => $this->faker->userName,
        'password' => bcrypt('password'),
    ]);
});

test('an admin can get order items information', function () {
    $orderItem = OrderItem::factory()->create();

    $this->actingAs($this->user);

    $response = $this->get('/api/admin/orders/' . $orderItem->order_id . '/items');

    $response->assertStatus(200);
});

test('a customer can not get order items information', function () {
    $orderItem = OrderItem::factory()->create();

    $customerUser = User::createCustomer([
        'first_name' => $this->faker->firstName,
        'last_name' => $this->faker->lastName,
        'email' => $this->faker->safeEmail,
        'username' => $this->faker->userName,
        'password' => bcrypt('password'),
    ]);

    $this->actingAs($customerUser);

    $response = $this->get('/api/admin/orders/' . $orderItem->order_id . '/items');

    $response->assertStatus(403);
});

test('an admin can add order item to order', function () {
    $orderItem = OrderItem::factory()->create();

    $this->actingAs($this->user);

    $newCard = CardProduct::factory()->create();

    $response = $this->postJson('/api/admin/orders/' . $orderItem->order_id . '/items', [
        'card_id' => $newCard->id,
        'value' => $this->faker->randomFloat($nbMaxDecimals = 2, $min = 1, $max = null),
    ]);
    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => [
            'card_product' => [
                'id',
            ],
        ],
    ]);
});

test('a customer can not add order item to order', function () {
    $orderItem = OrderItem::factory()->create();

    $customerUser = User::createCustomer([
        'first_name' => $this->faker->firstName,
        'last_name' => $this->faker->lastName,
        'email' => $this->faker->safeEmail,
        'username' => $this->faker->userName,
        'password' => bcrypt('password'),
    ]);

    $this->actingAs($customerUser);

    $newCard = CardProduct::factory()->create();

    $response = $this->postJson('/api/admin/orders/' . $orderItem->order_id . '/items', [
        'card_id' => $newCard->id,
        'value' => $this->faker->randomFloat($nbMaxDecimals = 2, $min = 1, $max = null),
    ]);
    $response->assertStatus(403);
});

test('a new order item needs data', function () {
    $orderItem = OrderItem::factory()->create();

    $this->actingAs($this->user);

    $response = $this->postJson('/api/admin/orders/' . $orderItem->order_id . '/items');
    $response->assertJsonValidationErrors([
        'card_id' => 'The card id field is required.',
        'value' => 'The value field is required.',
    ]);
});

test('an admin can update order item', function () {
    Event::fake();
    $orderItem = OrderItem::factory()->create();

    $this->actingAs($this->user);

    $newCard = CardProduct::factory()->create();

    $response = $this->putJson('/api/admin/orders/' . $orderItem->order_id . '/items/'.$orderItem->id, [
        'card_id' => $newCard->id,
        'value' => $this->faker->randomFloat($nbMaxDecimals = 2, $min = 1, $max = null),
    ]);
    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => [
            'card_product' => [
                'id',
            ],
        ],
    ]);
    $this->assertEquals($response['data']['card_product']['id'], $newCard->id);

    Event::assertDispatched(OrderItemCardChangedEvent::class);
});

test('a customer can not update order item', function () {
    $orderItem = OrderItem::factory()->create();

    $customerUser = User::createCustomer([
        'first_name' => $this->faker->firstName,
        'last_name' => $this->faker->lastName,
        'email' => $this->faker->safeEmail,
        'username' => $this->faker->userName,
        'password' => bcrypt('password'),
    ]);

    $this->actingAs($customerUser);

    $newCard = CardProduct::factory()->create();

    $response = $this->putJson('/api/admin/orders/' . $orderItem->order_id . '/items/'.$orderItem->id, [
        'card_id' => $newCard->id,
        'value' => $this->faker->randomFloat($nbMaxDecimals = 2, $min = 1, $max = null),
    ]);
    $response->assertStatus(403);
});

test('order item update fails with wrong card parameter', function () {
    $orderItem = OrderItem::factory()->create();

    $otherItem = OrderItem::factory()->create();

    $this->actingAs($this->user);

    $newCard = CardProduct::factory()->create();

    $response = $this->putJson('/api/admin/orders/' . $orderItem->order_id . '/items/'.$otherItem->id, [
        'card_id' => $newCard->id,
        'value' => $this->faker->randomFloat($nbMaxDecimals = 2, $min = 1, $max = null),
    ]);

    $response->assertJsonStructure(['error']);
});

test('an admin can update an order item status', function () {
    $orderItem = OrderItem::factory()->create();

    $this->actingAs($this->user);

    $this->postJson('/api/admin/orders/' . $orderItem->order_id . '/items/'.$orderItem->id. '/change-status', [
        'status' => 'missing',
        'notes' => 'Lorem',
    ])->assertStatus(200);
});

test('a customer can not update an order item status', function () {
    $orderItem = OrderItem::factory()->create();

    $customerUser = User::createCustomer([
        'first_name' => $this->faker->firstName,
        'last_name' => $this->faker->lastName,
        'email' => $this->faker->safeEmail,
        'username' => $this->faker->userName,
        'password' => bcrypt('password'),
    ]);

    $this->actingAs($customerUser);

    $response = $this->postJson('/api/admin/orders/' . $orderItem->order_id . '/items/'.$orderItem->id. '/change-status', [
        'status' => 'missing',
        'notes' => 'Lorem',
    ]);

    $response->assertStatus(403);
});

test('status update fails with wrong card parameter', function () {
    $otherItem = OrderItem::factory()->create();
    $orderItem = OrderItem::factory()->create();

    $this->actingAs($this->user);

    $response = $this->postJson('/api/admin/orders/' . $orderItem->order_id . '/items/'.$otherItem->id. '/change-status', [
        'status' => 'missing',
        'notes' => 'Lorem',
    ]);

    $response->assertJsonStructure(['error']);
});

test('desired status is required for status updated', function () {
    $orderItem = OrderItem::factory()->create();

    $this->actingAs($this->user);

    $response = $this->postJson('/api/admin/orders/' . $orderItem->order_id . '/items/'.$orderItem->id. '/change-status');
    $response->assertJsonValidationErrors([
        'status' => 'The status field is required.',
    ]);
});

test('status update fails with wrong desired status', function () {
    $orderItem = OrderItem::factory()->create();

    $this->actingAs($this->user);

    $response = $this->postJson('/api/admin/orders/' . $orderItem->order_id . '/items/'.$orderItem->id. '/change-status', [
        'status' => 'Lorem',
    ]);
    $response->assertJsonValidationErrors([
        'status' => 'The selected status is invalid.',
    ]);
});

test('an admin can mark multiple order items as pending', function () {
    $orderItem = OrderItem::factory()->create();

    $this->actingAs($this->user);

    $response = $this->postJson('/api/admin/orders/' . $orderItem->order_id . '/items/bulk/change-status', [
        "items" => [$orderItem->id],
        "status" => OrderStatus::ARRIVED,
    ]);

    $response->assertStatus(200);
});
test('a customer can not mark multiple order items as pending', function () {
    $orderItem = OrderItem::factory()->create();

    $customerUser = User::createCustomer([
        'first_name' => $this->faker->firstName,
        'last_name' => $this->faker->lastName,
        'email' => $this->faker->safeEmail,
        'username' => $this->faker->userName,
        'password' => bcrypt('password'),
    ]);

    $this->actingAs($customerUser);

    $response = $this->postJson('/api/admin/orders/' . $orderItem->order_id . '/items/bulk/change-status', [
        "items" => [$orderItem->id],
        "status" => OrderStatus::ARRIVED,
    ]);

    $response->assertStatus(403);
});

test('items are required for bulk set items as pending', function () {
    $orderItem = OrderItem::factory()->create();

    $this->actingAs($this->user);

    $response = $this->postJson('/api/admin/orders/' . $orderItem->order_id . '/items/bulk/change-status');

    $response->assertJsonValidationErrors([
        'items' => 'The items field is required.',
    ]);
});

test('an admin can update an existing order item status notes', function () {
    $orderItem = OrderItem::factory()->create();
    $orderItemStatusHistory = OrderItemStatusHistory::factory()->create([
        'order_item_id' => $orderItem->id,
        'order_item_status_id' => $orderItem->order_item_status_id,
    ]);

    $this->actingAs($this->user);
    $notes = 'Updating Item Status Notes';

    $this->postJson('/api/admin/orders/' . $orderItem->order->id . '/items/'. $orderItem->id. '/change-status', [
        'status' => $orderItemStatusHistory->order_item_status_id,
        'notes' => $notes,
    ])->assertStatus(200);
    $this->assertDatabaseHas('order_item_status_histories', [
        'notes' => $notes,
    ]);
});

test('an admin can update an existing order item status notes as empty', function () {
    $orderItem = OrderItem::factory()->create();
    $orderItemStatusHistory = OrderItemStatusHistory::factory()->create([
        'order_item_id' => $orderItem->id,
        'order_item_status_id' => $orderItem->order_item_status_id,
    ]);

    $this->actingAs($this->user);

    $this->postJson('/api/admin/orders/' . $orderItem->order->id . '/items/'. $orderItem->id. '/change-status', [
        'status' => $orderItemStatusHistory->order_item_status_id,
    ])->assertStatus(200);
    $this->assertDatabaseMissing('order_item_status_histories', [
        'notes' => $orderItemStatusHistory->notes,
    ]);
});

test('can swap card in AGS certificate', function () {
    Event::fake();
    Http::fake(['*' => Http::response(json_decode(file_get_contents(
        base_path() . '/tests/stubs/AGS_create_certificates_response_200.json'
    ), associative: true))]);

    $userCard = UserCard::factory()->create([
        'certificate_number' => '09000000',
    ]);

    $agsService = resolve(AgsService::class);
    $orderService = resolve(OrderService::class);

    $data = $orderService->getOrderItemCertificateData($userCard->orderItem);

    $response = $agsService->createCertificates($data);

    $this->assertEquals(count($response), 1);
    $this->assertArrayHasKey('certificate_id', $response[0]);
    $this->assertEquals($response[0]['certificate_id'], '09000000');
});
