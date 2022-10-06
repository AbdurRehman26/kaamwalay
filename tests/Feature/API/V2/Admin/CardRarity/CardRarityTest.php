<?php

use App\Models\CardProduct;
use App\Models\CardRarity;
use App\Models\OrderItem;
use App\Models\PopReportsCard;
use App\Models\User;
use App\Models\UserCard;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Http;

use function Pest\Laravel\getJson;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
    ]);

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

    $this->actingAs($this->user);
});

test('admins can get list of card rarities', function () {
    $this->getJson('api/v2/admin/cards/rarities')->assertOk()->assertJsonCount(100, 'data');
});

it('fails on repeated card number and params', function () {
    Http::fake([
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

    $response->assertStatus(422);
    $response->assertJsonFragment([
        'card_number' => ['This card number already exists in this set'],
    ]);
});

test('admins can update cards manually', function () {
    Http::fake([
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
    $cardProducts = CardProduct::factory()->count(100)->create();

    $cardProducts->take(10)->each(fn (CardProduct $cardProduct) => (
    PopReportsCard::factory()->create([
        'card_product_id' => $cardProduct->id,
    ])
    ));

    $response = $this->getJson(route('v2.admin.card-products.index', ['per_page' => 100]));

    $response->assertOk()->assertJsonCount(100, 'data');
});
