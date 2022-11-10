<?php

use App\Models\CardCategory;
use App\Models\CardSurface;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->categories = CardCategory::factory()->count(2)->create();

    CardSurface::factory()->count(5)->create([
        'card_category_id' => $this->categories[0]->id,
    ]);

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->actingAs($this->user);
});

test('admins can get list of card surfaces', function () {
    getJson(route('v2.surfaces.index'))->assertOk()->assertJsonCount(5, 'data');
});

test('a customer can not get card surfaces list', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();
    actingAs($user);
    getJson(route('v2.surfaces.index'))
        ->assertStatus(403);
});

test('a guest can not get card surfaces list', function () {
    getJson(route('v2.surfaces.index'))
        ->assertStatus(401);
});

test('admins can get list of card surfaces filter by name', function () {
    getJson(route('v2.surfaces.index', [
        'filter' => [
            'search' => CardSurface::first()->name,
        ],
    ]))->assertOk()->assertJsonCount(1, 'data')->assertJsonFragment([
        'name' => CardSurface::first()->name,
    ]);
});

test('admins can get list of card surfaces sort by name', function () {
    $response = getJson(route('v2.surfaces.index', ['sort' => '-name']))->assertOk();

    $this->assertEquals(
        CardSurface::orderBy('name', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

test('admins can get single card surface', function () {
    getJson(route('v2.surfaces.show', ['surface' => CardSurface::first()]))->assertSuccessful();
});

test('a customer can not get single card surface', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();
    actingAs($user);
    getJson(route('v2.surfaces.show'))
        ->assertStatus(403);
});

test('a guest can not get single card surface', function () {
    getJson(route('v2.surfaces.show'))
        ->assertStatus(401);
});

test('admins cannot create card surface with existing name in same category.', function () {
    postJson(route('v2.surfaces.store'), [
        'name' => CardSurface::first()->name,
        'card_category_id' => 1,
    ])->assertUnprocessable();
});

test('admins can create card surfaces', function () {
    postJson(route('v2.surfaces.store'), [
        'name' => 'Lorem Ipsum',
        'card_category_id' => $this->categories[0]->id,
    ])
        ->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                'name',
                'card_category',
            ],
        ])->dump()->assertJsonFragment([
            'name' => 'Lorem Ipsum',
        ])->assertJsonPath('data.card_category.id', $this->categories[0]->id);
});

test('a customer cannot create card surface', function () {
    $user = User::factory()->withRole(config('permission.roles.customer'))->create();
    actingAs($user);

    postJson(route('v2.surfaces.store'), [
        'name' => 'Lorem Ipsum',
        'card_category_id' => $this->categories[0]->id,
    ])
    ->assertStatus(403);
});

test('a guest cannot create card surface', function () {
    postJson(route('v2.surfaces.store'), [
        'name' => CardSurface::first()->name,
        'card_category_id' => 1,
    ])->assertStatus(401);
});

test('admins can update card surfaces', function () {
    $cardSurface = CardSurface::first();

    putJson(
        route('v2.surfaces.update', ['surface' => $cardSurface]),
        [
            'name' => 'Updated Name',
            'card_category_id' => $cardSurface->card_category_id,
        ]
    )->assertSuccessful();

    assertDatabaseHas('card_surfaces', [
        'name' => 'Updated Name',
        'id' => $cardSurface->id,
    ]);
});
