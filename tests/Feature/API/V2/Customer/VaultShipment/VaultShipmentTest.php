<?php

use App\Models\User;
use App\Models\UserCard;
use App\Models\VaultShipment;
use App\Models\VaultShipmentItem;
use Illuminate\Database\Eloquent\Factories\Sequence;

beforeEach(function () {
    $this->user = User::factory()->create();

    $this->shipments = VaultShipment::factory()
        ->for($this->user)
        ->count(2)
        ->create();

    $cards = UserCard::factory()->count(2)->state(new Sequence(
        ['certificate_number' => Str::uuid()],
        ['certificate_number' => Str::uuid()]
    ))->create();

    VaultShipmentItem::factory()->count(2)
        ->state(new Sequence(
            [
                'vault_shipment_id' => $this->shipments[0]->id,
                'user_card_id' => $cards[0]->id,
            ],
            [
                'vault_shipment_id' => $this->shipments[1]->id,
                'user_card_id' => $cards[1]->id,
            ],
        ))->create();
});

test('a customer only see own vault shipments', function () {
    $user = User::factory();
    VaultShipment::factory()
        ->for($user)
        ->has(VaultShipmentItem::factory())
        ->create();

    $this->actingAs($this->user);

    $response = $this->getJson(route('v2.customer.vault-shipments.index', ['include[]' => 'vaultShipmentStatus']));

    $response->assertOk();
    $response->assertJsonCount(2, ['data']);
    $response->assertJsonFragment([
        'cards_number' => $this->shipments[0]->vaultShipmentItems()->count(),
        'created_at' => $this->shipments[0]->created_at,
        'id' => $this->shipments[0]->id,
        'shipment_number' => $this->shipments[0]->shipment_number,
        'shipped_at' => $this->shipments[0]->shipped_at,
        'vault_shipment_status' => [
            'id' => $this->shipments[0]->vaultShipmentStatus->id,
            'code' => $this->shipments[0]->vaultShipmentStatus->code,
            'name' => $this->shipments[0]->vaultShipmentStatus->name,
            'description' => $this->shipments[0]->vaultShipmentStatus->description,
        ],
        'tracking_number' => $this->shipments[0]->tracking_number,
        'tracking_url' => $this->shipments[0]->tracking_url,
    ]);
});

test('a guest cannot see vault shipments', function () {
    $response = $this->getJson(route('v2.customer.vault-shipments.index'));

    $response->assertUnauthorized();
});

test('a customer can search shipments by shipment number', function () {
    $this->actingAs($this->user);

    $response = $this->getJson(
        route('v2.customer.vault-shipments.index', [
            'filter[search]' => $this->shipments[0]->shipment_number,
            'include[]' => 'vaultShipmentStatus',
        ])
    );

    $response->assertOk();
    $response->assertJsonCount(1, ['data']);
    $response->assertJsonFragment([
        'cards_number' => $this->shipments[0]->vaultShipmentItems()->count(),
        'created_at' => $this->shipments[0]->created_at,
        'id' => $this->shipments[0]->id,
        'shipment_number' => $this->shipments[0]->shipment_number,
        'shipped_at' => $this->shipments[0]->shipped_at,
        'vault_shipment_status' => [
            'id' => $this->shipments[0]->vaultShipmentStatus->id,
            'code' => $this->shipments[0]->vaultShipmentStatus->code,
            'name' => $this->shipments[0]->vaultShipmentStatus->name,
            'description' => $this->shipments[0]->vaultShipmentStatus->description,
        ],
        'tracking_number' => $this->shipments[0]->tracking_number,
        'tracking_url' => $this->shipments[0]->tracking_url,
    ]);
});

test('a customer can search shipments by item certificate number', function () {
    $this->actingAs($this->user);

    $response = $this->getJson(
        route('v2.customer.vault-shipments.index', [
            'filter[search]' => $this->shipments[0]->vaultShipmentItems[0]->userCard->certificate_number,
            'include[]' => 'vaultShipmentStatus',
        ])
    );

    $response->assertOk();
    $response->assertJsonCount(1, ['data']);
    $response->assertJsonFragment([
        'cards_number' => $this->shipments[0]->vaultShipmentItems()->count(),
        'created_at' => $this->shipments[0]->created_at,
        'id' => $this->shipments[0]->id,
        'shipment_number' => $this->shipments[0]->shipment_number,
        'shipped_at' => $this->shipments[0]->shipped_at,
        'vault_shipment_status' => [
            'id' => $this->shipments[0]->vaultShipmentStatus->id,
            'code' => $this->shipments[0]->vaultShipmentStatus->code,
            'name' => $this->shipments[0]->vaultShipmentStatus->name,
            'description' => $this->shipments[0]->vaultShipmentStatus->description,
        ],
        'tracking_number' => $this->shipments[0]->tracking_number,
        'tracking_url' => $this->shipments[0]->tracking_url,
    ]);
});
