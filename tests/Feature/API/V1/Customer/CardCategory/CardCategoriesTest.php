<?php

use App\Models\CardCategory;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\seed;

test('customer can receive card categories', function () {
    seed([RolesSeeder::class]);
    actingAs(User::factory()->withRole(config('permission.roles.customer'))->create());
    CardCategory::factory()->count(5)->create();

    getJson(route('v1.cards.categories'))
        ->assertOk()
        ->assertJsonCount(5, 'data')
        ->assertJsonStructure(['data' => [['id', 'name']]]);
});
