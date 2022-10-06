<?php

use App\Models\User;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardRaritiesSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

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
