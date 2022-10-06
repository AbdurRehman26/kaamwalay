<?php

use App\Models\CardProduct;
use App\Models\CardRarity;
use App\Models\OrderItem;
use App\Models\PopReportsCard;
use App\Models\User;
use App\Models\UserCard;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardRaritiesSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Http;

use function Pest\Laravel\getJson;

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
    $this->getJson('api/v2/admin/cards/rarities')->assertOk()->assertJsonCount(5, 'data');
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
