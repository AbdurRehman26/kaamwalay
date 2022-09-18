<?php

use App\Models\CustomerAddress;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->customers = User::factory()->count(2)->create();
    $this->addresses = CustomerAddress::factory()
        ->count(3)
        ->state(new Sequence(
            ['user_id' => $this->customers[0]->id],
            ['user_id' => $this->customers[0]->id],
            ['user_id' => $this->customers[1]->id],
        ))
        ->create();

    $this->actingAs($this->user);
});

test('an admin can list addresses for specific customer', function () {
    $response = $this->getJson('/api/v2/admin/customer/'. $this->customers[0]->id .'/addresses');
    $response->assertJsonStructure([
        'data' => [['id', 'first_name', 'last_name', 'state']],
    ]);

    $response->assertJsonCount(2, 'data');
});
