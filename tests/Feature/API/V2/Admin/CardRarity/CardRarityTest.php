<?php

use App\Models\CardCategory;
use App\Models\CardRarity;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->categories = CardCategory::factory()->count(2)->create();

    CardRarity::factory()->count(5)->create([
        'card_category_id' => $this->categories[0]->id,
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

test('admins can get list of card rarities filter by name', function () {
    getJson(route('v2.rarities.index', [
        'filter' => [
            'search' => CardRarity::first()->name,
        ],
    ]))->assertOk()->assertJsonCount(1, 'data')->assertJsonFragment([
        'name' => CardRarity::first()->name,
    ]);
});

test('admins can get list of card rarities sort by name', function () {
    $response = getJson(route('v2.rarities.index', ['sort' => '-name']))->assertOk();

    $this->assertEquals(
        CardRarity::orderBy('name', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

test('admins can get single card rarity', function () {
    getJson(route('v2.rarities.show', ['rarity' => cardRarity::first()]))->assertSuccessful();
});

test('admins cannot create card rarity with existing name in same category.', function () {
    postJson(route('v2.rarities.store'), [
        'name' => CardRarity::first()->name,
        'card_category_id' => 1,
    ])->assertUnprocessable();
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
        route('v2.rarities.update', ['rarity' => $cardRarity]),
        [
            'name' => 'Updated Name',
            'card_category_id' => $cardRarity->card_category_id,
        ]
    )->assertSuccessful();

    assertDatabaseHas('card_rarities', [
        'name' => 'Updated Name',
        'id' => $cardRarity->id,
    ]);
});
