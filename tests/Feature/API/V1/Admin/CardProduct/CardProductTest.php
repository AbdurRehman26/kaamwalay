<?php

use App\Models\CardProduct;
use App\Models\User;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Http;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
    ]);

    $this->card = CardProduct::factory()->create();

    $this->user = User::factory()
        ->admin()
        ->withRole(config('permission.roles.admin'))
        ->create();

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
        '*/series/*' => Http::response($this->sampleGetSeriesResponse, 200, []),
        '*/sets/*' => Http::response($this->sampleGetSetResponse, 200, []),
        '*/cards/*' => Http::response($this->sampleCreateCardResponse, 200, []),
    ]);

    $response = $this->postJson('/api/v1/admin/cards', [
        'name' => 'Lorem Ipsum',
        'description' => 'Lorem ipsum dolor sit amet.',
        'image_path' => 'http://www.google.com',
        'category' => 1,
        'release_date' => '2021-11-06',
        'series_name' => 'Admin Series',
        'series_image' => 'http://www.google.com',
        'set_name' => 'Admin Set',
        'set_image' => 'http://www.google.com',
        'card_number' => '001',
        'language' => 'English',
        'rarity' => 'Common',
        'edition' => '1st Edition',
        'surface' => 'Holo',
        'variant' => 'Lorem',
    ]);

    $response->assertSuccessful();
    $response->assertJsonFragment([
        'long_name' => "2021 Pokemon Admin Series Admin Set 001",
        'short_name' => "1st Edition - Holo - Lorem",
        'name' => "Lorem Ipsum",
        'card_category_name' => "Pokemon",
        'card_set_name' => "Admin Set",
        'card_series_name' => "Admin Series",
        'release_date' => "2021-11-06T00:00:00.000000Z",
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

it('fails on repeated series name', function () {
    Http::fake([
        '*/series/*' => Http::response($this->sampleGetSeriesResponse, 200, []),
        '*/sets/*' => Http::response($this->sampleGetSetResponse, 200, []),
        '*/cards/*' => Http::response($this->sampleCreateCardResponse, 200, []),
    ]);

    $response = $this->postJson('/api/v1/admin/cards', [
        'name' => 'Lorem Ipsum',
        'description' => 'Lorem ipsum dolor sit amet.',
        'image_path' => 'http://www.google.com',
        'category' => $this->card->cardSet->cardSeries->card_category_id,
        'release_date' => '2021-11-06',
        'series_name' => $this->card->cardSet->cardSeries->name,
        'series_image' => 'http://www.google.com',
        'set_name' => 'Admin Set',
        'set_image' => 'http://www.google.com',
        'card_number' => '001',
        'language' => 'English',
        'rarity' => 'Common',
        'edition' => '1st Edition',
        'surface' => 'Holo',
        'variant' => 'Lorem',
    ]);

    $response->assertStatus(422);
    $response->assertJsonFragment([
        'series_name' => ['The series name has already been taken.'],
    ]);
});

it('fails on repeated set name', function () {
    Http::fake([
        '*/series/*' => Http::response($this->sampleGetSeriesResponse, 200, []),
        '*/sets/*' => Http::response($this->sampleGetSetResponse, 200, []),
        '*/cards/*' => Http::response($this->sampleCreateCardResponse, 200, []),
    ]);

    $response = $this->postJson('/api/v1/admin/cards', [
        'name' => 'Lorem Ipsum',
        'description' => 'Lorem ipsum dolor sit amet.',
        'image_path' => 'http://www.google.com',
        'category' => $this->card->cardSet->cardSeries->card_category_id,
        'release_date' => '2021-11-06',
        'series_id' => $this->card->cardSet->card_series_id,
        'set_name' => $this->card->cardSet->name,
        'set_image' => 'http://www.google.com',
        'card_number' => '001',
        'language' => 'English',
        'rarity' => 'Common',
        'edition' => '1st Edition',
        'surface' => 'Holo',
        'variant' => 'Lorem',
    ]);

    $response->assertStatus(422);
    $response->assertJsonFragment([
        'set_name' => ['The set name has already been taken.'],
    ]);
});

it('fails on repeated card number', function () {
    Http::fake([
        '*/series/*' => Http::response($this->sampleGetSeriesResponse, 200, []),
        '*/sets/*' => Http::response($this->sampleGetSetResponse, 200, []),
        '*/cards/*' => Http::response($this->sampleCreateCardResponse, 200, []),
    ]);

    $response = $this->postJson('/api/v1/admin/cards', [
        'name' => 'Lorem Ipsum',
        'description' => 'Lorem ipsum dolor sit amet.',
        'image_path' => 'http://www.google.com',
        'category' => $this->card->cardSet->cardSeries->card_category_id,
        'release_date' => '2021-11-06',
        'series_id' => $this->card->cardSet->card_series_id,
        'set_id' => $this->card->card_set_id,
        'card_number' => strval($this->card->card_number_order),
        'language' => 'English',
        'rarity' => 'Common',
        'edition' => '1st Edition',
        'surface' => 'Holo',
        'variant' => 'Lorem',
    ]);

    $response->assertStatus(422);
    $response->assertJsonFragment([
        'card_number' => ['This card number already exists in this set'],
    ]);
});
