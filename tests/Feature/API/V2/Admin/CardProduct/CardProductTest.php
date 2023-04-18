<?php

use App\Models\CardProduct;
use App\Models\CardRarity;
use App\Models\CardSurface;
use App\Models\OrderItem;
use App\Models\PopReportsCard;
use App\Models\User;
use App\Models\UserCard;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Http;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
        CardSeriesSeeder::class,
        CardSetsSeeder::class,
    ]);

    $this->card = CardProduct::factory()->create([
        'language' => 'English',
        'rarity' => 'Common',
        'surface' => '',
        'card_reference_id' => Str::random(),
    ]);

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    CardRarity::create([
        'card_category_id' => 1,
        'name' => 'Rare Holo',
    ]);

    CardRarity::create([
        'card_category_id' => $this->card->cardSet->cardSeries->card_category_id,
        'name' => $this->card->rarity,
    ]);

    CardSurface::create([
        'card_category_id' => 1,
        'name' => 'Holo',
    ]);

    $this->sampleGetCategoryResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/AGS_get_category_response_200.json'
    ), associative: true);

    $this->sampleGetSeriesResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/AGS_get_series_response_200.json'
    ), associative: true);

    $this->sampleGetSetResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/AGS_get_set_response_200.json'
    ), associative: true);

    $this->sampleCreateCardResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/AGS_create_card_response_200.json'
    ), associative: true);

    $this->actingAs($this->user);
});

test('admins can create cards manually', function () {
    Http::fake([
        '*/categories/*' => Http::response($this->sampleGetCategoryResponse, 200, []),
        '*/series/*' => Http::response($this->sampleGetSeriesResponse, 200, []),
        '*/sets/*' => Http::response($this->sampleGetSetResponse, 200, []),
        '*/cards/*' => Http::response($this->sampleCreateCardResponse, 200, []),
    ]);

    $response = $this->postJson('/api/v2/admin/cards', [
        'name' => 'Lorem Ipsum',
        'description' => 'Lorem ipsum dolor sit amet.',
        'image_path' => 'http://www.google.com',
        'category' => 1,
        'release_date' => '2021-03-19',
        'series_id' => 1,
        'set_id' => 1,
        'card_number' => '001',
        'language' => 'English',
        'rarity' => 'Rare Holo',
        'edition' => '1st Edition',
        'surface' => 'Holo',
        'variant' => 'Lorem',
    ]);

    $response->assertSuccessful();
    $response->assertJsonFragment([
        'long_name' => "2021 Pokemon Sword & Shield Series Battle Styles 001",
        'short_name' => "1st Edition - Holo - Lorem",
        'name' => "Lorem Ipsum",
        'card_category_name' => "Pokemon",
        'card_set_name' => "Battle Styles",
        'card_series_name' => "Sword & Shield Series",
        'release_date' => "2021-03-19T00:00:00.000000Z",
        'release_year' => 2021,
        'card_number_order' => "001",
        'image_path' => "http://www.google.com",
        'language' => "English",
        'variant' => "Lorem",
        'surface' => "Holo",
        'edition' => "1st Edition",
        'added_by_customer' => false,
    ]);
});

it('creates card with one different param from existing card', function () {
    Http::fake([
        '*/categories/*' => Http::response($this->sampleGetCategoryResponse, 200, []),
        '*/series/*' => Http::response($this->sampleGetSeriesResponse, 200, []),
        '*/sets/*' => Http::response($this->sampleGetSetResponse, 200, []),
        '*/cards/*' => Http::response($this->sampleCreateCardResponse, 200, []),
    ]);

    $response = $this->postJson(route('v2.admin.card-products.store', ['cardProduct' => $this->card]), [
        'name' => 'Lorem Ipsum',
        'description' => 'Lorem ipsum dolor sit amet.',
        'image_path' => 'http://www.google.com',
        'category' => $this->card->cardSet->cardSeries->card_category_id,
        'release_date' => '2021-11-06',
        'series_id' => $this->card->cardSet->card_series_id,
        'set_id' => $this->card->card_set_id,
        'card_number' => strval($this->card->card_number_order),
        'language' => $this->card->language,
        'rarity' => $this->card->rarity,
        'edition' => $this->card->edition,
        'surface' => $this->card->surface,
        'variant' => 'Lorem',
    ]);

    $response->assertSuccessful();
});

test('admins can update cards manually', function () {
    Http::fake([
        '*/categories/*' => Http::response($this->sampleGetCategoryResponse, 200, []),
        '*/series/*' => Http::response($this->sampleGetSeriesResponse, 200, []),
        '*/sets/*' => Http::response($this->sampleGetSetResponse, 200, []),
        '*/cards/*' => Http::response($this->sampleCreateCardResponse, 200, []),
        '*/find-card/*' => Http::response($this->sampleCreateCardResponse, 200, []),
    ]);

    $response = $this->put(route('v2.admin.card-products.update', ['cardProduct' => $this->card]), [
        'name' => 'Lorem Ipsum',
        'description' => 'Lorem ipsum dolor sit amet.',
        'image_path' => 'http://www.google.com',
        'category' => 1,
        'release_date' => '2021-03-19',
        'series_id' => 1,
        'set_id' => 1,
        'card_number' => '002',
        'language' => 'Japanese',
        'rarity' => 'Rare Holo',
        'edition' => 'Shadowless',
        'surface' => 'Holo',
        'variant' => 'Lorem',
    ]);

    $response->assertSuccessful();
    $response->assertJsonFragment([
        'language' => "Japanese",
        'variant' => "Lorem",
        'surface' => "Holo",
        'edition' => "Shadowless",
    ]);
});

test('admins can delete a card', function () {
    Http::fake([
        '*/find-card/*' => Http::response($this->sampleCreateCardResponse, 200, []),
        '*/cards/*' => Http::response([
                "app_status" => 1,
                "app_message" => [
                    "Removed successfully",
                ],
            ], 204),
    ]);

    $response = $this->deleteJson(route('v2.admin.card-products.destroy', ['cardProduct' => $this->card]));

    $response->assertNoContent();
});

test('admins can get a single card', function () {
    $response = $this->getJson(route('v2.admin.card-products.show', ['cardProduct' => $this->card]));

    $response->assertSuccessful();
});

test('admins can not delete a card if it has graded items', function () {
    $orderItem = OrderItem::factory()->create([
        'card_product_id' => $this->card->id,
    ]);

    UserCard::factory()->create([
        'order_item_id' => $orderItem->id,
    ]);

    $response = $this->deleteJson(route('v2.admin.card-products.destroy', ['cardProduct' => $this->card]));

    $response->assertForbidden();
});

test('admins can get get a list of card products', function () {
    $cardProducts = CardProduct::factory()->count(100)->create([
        'added_manually' => 0,
    ]);

    $cardProducts->take(10)->each(fn (CardProduct $cardProduct) => (
        PopReportsCard::factory()->create([
            'card_product_id' => $cardProduct->id,
        ])
    ));

    $response = $this->getJson(route('v2.admin.card-products.index', ['per_page' => 100]));

    $response->assertOk()->assertJsonCount(100, 'data');
})->skip(fn () => DB::getDriverName() !== 'mysql', 'Only runs when using mysql');
