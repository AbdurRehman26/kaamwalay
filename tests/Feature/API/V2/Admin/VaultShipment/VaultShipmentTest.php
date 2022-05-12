<?php

namespace Tests\Feature\API\V2\Admin\VaultShipment;

use App\Models\User;
use App\Models\VaultShipment;
use App\Services\EmailService;
use Bus;
use Database\Seeders\RolesSeeder;

use function Pest\Laravel\seed;

beforeEach(function () {
    seed(RolesSeeder::class);
    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->otherUser = User::factory()->withRole(config('permission.roles.customer'))->create();

    $this->vault = VaultShipment::factory()->for($this->otherUser)->create();
    $this->actingAs($this->user);
});

it('admin can get vault shipment list', function () {
    $response = $this->getJson(route('v2.admin.vault-shipments.index'));
    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            [
                'id',
                'shipment_number',
                'shipped_at',
                'cards_number',
                'tracking_number',
                'shipping_provider',
                'tracking_url',
            ],
        ],
    ]);
});

it('admin can get single vault shipment', function () {
    $response = $this->getJson(route('v2.admin.vault-shipments.show', ['vaultShipment' => $this->vault->id]));
    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'id',
            'shipment_number',
            'shipped_at',
            'cards_number',
            'tracking_number',
            'shipping_provider',
            'tracking_url',
        ],
    ]);
});

test('an admin update vault shipment', function () {
    Bus::fake();
    $this->putJson(route('v2.admin.vault-shipments.update-shipment', ['vaultShipment' => $this->vault->id]), [
        'shipping_provider' => 'usps',
        'tracking_number' => '9400100000000000000000',
    ])->assertSuccessful()
    ->assertJsonStructure([
        'data' => [
            'shipping_provider',
            'tracking_number',
        ],
    ]);
});

test('vault shipment update with valid data', function () {
    $response = $this->putJson(route('v2.admin.vault-shipments.update-shipment', ['vaultShipment' => $this->vault->id]), [
        'shipping_provider' => '',
        'tracking_number' => '',
    ]);
    $response->assertJsonValidationErrors([
        'shipping_provider' => 'The shipping provider field is required.',
        'tracking_number' => 'The tracking number field is required.',
    ]);
});

test('a guest can not update shipment', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->putJson(route('v2.admin.vault-shipments.update-shipment', ['vaultShipment' => $this->vault->id]), [
        'shipping_provider' => 'usps',
        'tracking_number' => '9400100000000000000000',
    ])->assertForbidden();
});
