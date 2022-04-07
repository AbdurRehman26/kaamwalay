<?php

use App\Models\User;
use App\Models\VaultShipment;
use App\Models\VaultShipmentItem;

beforeEach(function () {
    $this->user = User::factory()->create();

    $this->shipments = VaultShipment::factory()
        ->for($this->user)
        ->count(2)
        ->has(VaultShipmentItem::factory())
        ->create();
});

test('a customer only see own orders', function () {
    $user = User::factory();
    VaultShipment::factory()
        ->for($user)
        ->has(VaultShipmentItem::factory())
        ->create();

    $this->actingAs($this->user);

    $response = $this->getJson('/api/v2/customer/vault-shipments');

    $response->assertOk();
    $response->assertJsonCount(2, ['data']);
});

test('a guest cannot see vault shipments', function () {
    $response = $this->getJson('/api/v2/customer/vault-shipments/');

    $response->assertUnauthorized();
});
