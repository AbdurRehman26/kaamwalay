<?php

use App\Models\CardSeries;
use App\Models\CardSet;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->series = CardSeries::factory()->count(2)->create();

    CardSet::factory()->count(2)->create([
        'card_series_id' => 1,
    ]);

    CardSet::factory()->count(3)->create([
        'card_series_id' => 2,
    ]);

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->actingAs($this->user);
});

test('admins can get card set list', function () {
    $response = $this->getJson('/api/admin/cards/sets');

    $response->assertSuccessful();
});

test('admins can filter card set list by series', function () {
    $response = $this->getJson('/api/admin/cards/sets?series_id=' . $this->series[0]->id);

    $response->assertSuccessful();
    $response->assertJsonCount(2, ['data']);
});
