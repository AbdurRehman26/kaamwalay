<?php

use App\Models\Country;
use App\Models\State;
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

    $this->countries = Country::factory()->count(2)->create();
    $this->states = State::factory()
        ->count(5)
        ->state(new Sequence(
            ['country_id' => $this->countries[0]->id],
            ['country_id' => $this->countries[0]->id],
            ['country_id' => $this->countries[0]->id],
            ['country_id' => $this->countries[1]->id],
            ['country_id' => $this->countries[1]->id],
        ))->create();

    $this->actingAs($this->user);
});

test('an admin can list states', function () {
    $response = $this->getJson('/api/v2/admin/addresses/states/');

    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'code', 'name'],
        ],
    ]);
});

test('an admin can list states filtered for specific country', function () {
    $response = $this->getJson('/api/v2/admin/addresses/states?country_id='.$this->countries[0]->id);

    $response->assertJsonCount(3, 'data');
});
