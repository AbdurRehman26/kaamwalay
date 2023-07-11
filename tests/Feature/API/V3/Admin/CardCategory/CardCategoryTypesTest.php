<?php

use App\Models\CardCategoryType;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->cardCategoryType = CardCategoryType::factory()
        ->count(10)
        ->create();

    actingAs($this->user);
});

test('an admin can get card category types', function () {
    getJson(route('v3.admin.cards.category-types.index'))->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                [
                    'id',
                    'name',
                ],
            ],
        ]);
});

test('a customer cannot get card category types', function () {
    $customerUser = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create();

    actingAs($customerUser);

    getJson(route('v3.admin.cards.category-types.index'))->assertForbidden();
});
