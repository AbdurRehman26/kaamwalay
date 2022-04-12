<?php

namespace Tests\Feature\API\V2\Admin\VaultShipment;

use App\Models\User;
use App\Models\VaultShipment;
use Database\Seeders\RolesSeeder;

use function Pest\Laravel\seed;

beforeEach(function () {
    seed(RolesSeeder::class);
    $this->user =  User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->otherUser =  User::factory()->withRole(config('permission.roles.customer'))->create();

    $this->actingAs($this->user);
    $this->vault = VaultShipment::factory()->for($this->otherUser)->create();

});

it('admin can get vault shipment list', function () {
    $response = $this->getJson('/api/v2/admin/vaultshipments');
    $response->assertSuccessful();
});

it('admin can get single vault shipment', function () {
    
    $response = $this->getJson('/api/v2/admin/vaultshipments/'. $this->vault->id);
    $response->assertSuccessful();
    });

    // test('an admin can set vault shipment', function () {
    //     $this->postJson('/api/v2/admin/vaultshipments/' . $this->vault->id .'/shipment', [
    //         'shipping_provider' => 'usps',
    //         'tracking_number' => '9400100000000000000000',
    //     ])
    //         ->assertSuccessful()
            
    //         ->assertJsonStructure([
    //             'data' => [
    //                 'shipping_provider',
    //                 'tracking_number',
    //             ],
    //         ])
    //         ;
    // });