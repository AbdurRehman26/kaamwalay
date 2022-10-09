<?php

use App\Models\CardRarity;
use App\Models\User;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardRaritiesSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
        CardRaritiesSeeder::class
    ]);

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->actingAs($this->user);
});

test('admins can get list of card rarities', function () {
    getJson(route('v2.rarities.index'))->assertOk()->assertJsonCount(5, 'data');
});

test('admins can create card rarities', function () {
    postJson(route('v2.rarities.store'), [
        'name' => 'Lorem Ipsum',
        'card_category_id' => 1,
    ])
        ->assertSuccessful()
        ->assertJsonFragment([
            'name' => 'Lorem Ipsum',
            'card_category_id' => 1,
    ]);
});

test('admins can update card rarities', function () {
    $cardRarity = CardRarity::first();

    putJson(
        route('v2.rarities.update', ['rarity' => $cardRarity->id]),
        ['name' => 'Updated Name']
    )->assertSuccessful()
        ->dump()
        ->assertJsonFragment([
            'name' => 'Lorem Ipsum',
            'card_category_id' => 1,
        ]);
});
