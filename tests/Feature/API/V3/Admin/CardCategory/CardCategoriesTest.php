<?php

use App\Models\CardCategoryType;
use App\Models\User;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->cardCategoryType = CardCategoryType::factory()
        ->create();

    $this->actingAs($this->user);

    $this->sampleGetCategoriesResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/AGS_get_categories_response_200.json'
    ), associative: true);
});

test('an admin can create card category', function () {

    Http::fake([
        '*/categories/*' => Http::response($this->sampleGetCategoriesResponse, 200, []),
    ]);

    $this->postJson(route('v3.admin.cards.categories.store'), [
        'card_category_type' => $this->cardCategoryType->id,
        'name' => 'Lorem Ipsum',
        'image_url' => 'https://mann.org/quia-quos-et-nihil.html',
    ])->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                'name',
                'image_url',
            ],
        ]);
});

test('a customer cannot create card category', function () {
    
    $customerUser = User::factory()
    ->withRole(config('permission.roles.customer'))
    ->create();

    $this->actingAs($customerUser);

    $this->postJson(route('v3.admin.cards.categories.store'), [
        'name' => 'Lorem Ipsum',
        'image_url' => 'https://mann.org/quia-quos-et-nihil.html',
    ])->assertForbidden();
});
