<?php

use App\Models\CardCategory;
use App\Models\CardSeries;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->categories = CardCategory::factory()->count(2)->create();

    CardSeries::factory()->count(2)->create([
        'card_category_id' => 1,
    ]);

    CardSeries::factory()->count(3)->create([
        'card_category_id' => 2,
    ]);

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->actingAs($this->user);
});

test('admins can get card series list', function () {
    $response = $this->getJson('/api/v1/admin/cards/series');

    $response->assertSuccessful();
});

test('admins can filter card series list by category', function () {
    $response = $this->getJson('/api/v1/admin/cards/series?category_id=' . $this->categories[0]->id);

    $response->assertSuccessful();
    $response->assertJsonCount(2, ['data']);
});
