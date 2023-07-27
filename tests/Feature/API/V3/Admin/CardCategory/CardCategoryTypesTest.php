<?php

use App\Models\CardCategoryType;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);
});

test('an admin can get card category types', function () {
    $admin = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    CardCategoryType::factory()
        ->count(10)
        ->create();

    actingAs($admin);

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
    $customer = User::factory()
        ->withRole(config('permission.roles.customer'))
        ->create();

    actingAs($customer);

    getJson(route('v3.admin.cards.category-types.index'))->assertForbidden();
});
