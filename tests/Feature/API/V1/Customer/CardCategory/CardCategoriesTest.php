<?php

use App\Models\CardCategory;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

test('customer can receive card categories', function () {
    actingAs(User::factory()->withRole(config('permission.roles.customer'))->create());
    CardCategory::factory()->count(5)->create();

    getJson(route('cards.categories'))
        ->assertOk()
        ->assertJsonCount(5, 'data')
        ->assertJsonStructure(['data' => [['id', 'name']]]);
});
