<?php

use App\Models\Country;
use App\Models\User;
use Database\Seeders\RolesSeeder;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->countries = Country::factory()->count(5)->create();
});

test('an admin can list countries', function () {
    $this->actingAs($this->user);

    $response = $this->getJson('/api/v2/admin/addresses/countries/');

    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'code', 'name'],
        ],
    ]);
});
