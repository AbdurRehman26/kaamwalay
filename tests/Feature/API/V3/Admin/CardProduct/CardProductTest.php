<?php

use App\Events\API\Admin\Card\CardProductDeletedEvent;
use App\Models\CardProduct;
use App\Models\CardRarity;
use App\Models\CardSurface;
use App\Models\User;
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

test('admins can delete a card', function () {
    Event::fake();
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

    Event::assertDispatched(CardProductDeletedEvent::class);

});
