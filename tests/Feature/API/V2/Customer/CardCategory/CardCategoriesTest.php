<?php

use App\Models\CardCategory;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\seed;

test('customer can receive enabled card categories', function () {
    seed([RolesSeeder::class]);
    actingAs(User::factory()->withRole(config('permission.roles.customer'))->create());

    CardCategory::factory()->count(4)
        ->state(new Sequence(
            ['is_enabled' => true],
            ['is_enabled' => true],
            ['is_enabled' => false],
            ['is_enabled' => false]
        ))
        ->create();

    getJson(route('v1.cards.categories'))
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonStructure(['data' => [['id', 'name', 'is_enabled']]]);
});
