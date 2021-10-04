<?php

use App\Exceptions\API\Customer\Cards\CardDoesNotBelongToUser;
use App\Models\User;
use App\Models\UserCard;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->userCard = UserCard::factory()->for($this->user)->create();
});

test('customers can see their cards', function () {
    $this->actingAs($this->user);

    $response = $this->getJson('/api/customer/' . $this->user->id . '/cards');

    $response->assertStatus(200);
});

test('a customer can not see cards owned by others', function () {
    $otherUser = User::factory()->create();
    $this->actingAs($otherUser);

    $response = $this->getJson('/api/customer/' . $this->user->id . '/cards');

    $response->assertForbidden();
});

test('customers can see their card details', function () {
    $this->actingAs($this->user);

    $response = $this->getJson('/api/customer/' . $this->user->id . '/cards/' . $this->userCard->id);

    $response->assertStatus(200);
});

test('a customer can not see details of a card not owned by others', function () {
    $otherUser = User::factory()->create();
    $this->actingAs($otherUser);

    $response = $this->getJson('/api/customer/' . $this->user->id . '/cards/' . $this->userCard->id);

    $response->assertForbidden();
});

test('a customer can not access other user cards endpoint', function () {
    $otherUser = User::factory()->create();
    $otherUserCard = UserCard::factory()->for($otherUser)->create();
    $this->actingAs($otherUser);

    $response = $this->getJson('/api/customer/' . $this->user->id . '/cards/' . $otherUserCard->id);

    $response->assertJsonPath('error', (new CardDoesNotBelongToUser)->getMessage());
});