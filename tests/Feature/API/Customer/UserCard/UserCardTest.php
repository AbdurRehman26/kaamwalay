<?php

use App\Models\User;
use App\Models\UserCard;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->userCard = UserCard::factory()->for($this->user)->create();
});

test('customers can see their cards', function () {
    $this->actingAs($this->user);

    $response = $this->getJson('/api/customer/cards');

    $response->assertStatus(200);
});

test('customers can see their card details', function () {
    $this->actingAs($this->user);

    $response = $this->getJson('/api/customer/cards/' . $this->userCard->id);

    $response->assertStatus(200);
});

test('a customer can not see details of a card owned by others', function () {
    $otherUser = User::factory()->create();
    $this->actingAs($otherUser);

    $response = $this->getJson('/api/customer/cards/' . $this->userCard->id);

    $response->assertForbidden();
});
