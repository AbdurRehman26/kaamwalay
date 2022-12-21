<?php

use App\Models\DatabaseNotification;
use App\Models\User;

use Illuminate\Database\Eloquent\Factories\Sequence;

use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('a customer can see their push notifications', function () {
    $this->otherUser = User::factory()->create();

    $notificationDataForCustomer = ['title' => 'Title1', 'body' => 'Body1', 'intent' => []];
    DatabaseNotification::factory()->count(5)->create(['notifiable_id' => $this->user->id, 'data' => $notificationDataForCustomer]);

    $notificationDataForOtherUser = ['title' => 'Title2', 'body' => 'Body2', 'intent' => []];
    DatabaseNotification::factory()->count(2)->create(['notifiable_id' => $this->otherUser->id, 'data' => $notificationDataForOtherUser]);

    $response = getJson(route('v3.customer.push-notifications.index'));

    $response->assertOk()->assertJsonCount(5, 'data')->assertJsonFragment(['title' => 'Title1'])->assertJsonMissing(['title' => 'Title2']);
});

test('a customer can set pagination count', function () {
    $notificationDataForCustomer = ['title' => 'Title1', 'body' => 'Body1', 'intent' => []];
    DatabaseNotification::factory()->count(5)->create(['notifiable_id' => $this->user->id, 'data' => $notificationDataForCustomer]);

    $response = getJson(route('v3.customer.push-notifications.index', ['per_page' => 2]));

    $response->assertOk()->assertJsonCount(2, 'data');
});

test('a customer can mark a notification as read', function () {
    $notification = DatabaseNotification::factory()->create(['notifiable_id' => $this->user->id, 'read_at' => null]);

    $response = postJson(route('v3.customer.push-notifications.mark-as-read', ['notification' => $notification->id]));

    $response->assertOk()->assertJsonFragment(['id' => $notification->id]);
    expect($response['data']['read_at'])->not()->toBeNull();
    assertDatabaseMissing('notifications', ['id' => $notification->id, 'read_at' => null]);
});

test('a customer can mark all notifications as read', function () {
    DatabaseNotification::factory()->count(2)->create(['notifiable_id' => $this->user->id, 'read_at' => null]);

    postJson(route('v3.customer.push-notifications.mark-all-as-read'))->assertOk()->assertJsonFragment([
        'success' => true,
        'message' => 'All notifications have been marked as read.',
    ]);

    assertDatabaseMissing('notifications', ['read_at' => null]);
});

test('a customer cannot mark someone else\'s notification as read', function () {
    DatabaseNotification::factory()->create(['notifiable_id' => $this->user->id, 'read_at' => null]);

    $this->otherUser = User::factory()->create();
    $notificationForOtherUser = DatabaseNotification::factory()->create(['notifiable_id' => $this->otherUser->id, 'read_at' => null]);

    $response = postJson(route('v3.customer.push-notifications.mark-as-read', ['notification' => $notificationForOtherUser->id]));

    $response->assertForbidden();
});

test('a customer can see their stats', function () {
    DatabaseNotification::factory()
        ->count(5)
        ->state(new Sequence(
            ['read_at' => now()],
            ['read_at' => null],
            ['read_at' => null],
            ['read_at' => now()],
            ['read_at' => now()],
        ))
        ->create(['notifiable_id' => $this->user->id]);

    $response = getJson(route('v3.customer.push-notifications.stats'));

    $response->assertOk()->assertJsonFragment([
        'data' => [
            'unread_count' => 2,
            'read_count' => 3,
            'total' => 5,
        ],
    ]);
});
