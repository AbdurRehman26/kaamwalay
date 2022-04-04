<?php

use App\Models\CardCategory;
use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Models\PopReportsCard;
use App\Models\PopReportsSeries;
use App\Models\PopReportsSet;
use Illuminate\Database\Eloquent\Factories\Sequence;

use function Pest\Laravel\getJson;

test('a guest can receive enabled card categories for pop report page', function () {
    CardCategory::factory()->count(4)
        ->state(new Sequence(
            ['is_enabled' => true],
            ['is_enabled' => true],
            ['is_enabled' => false],
            ['is_enabled' => false]
        ))
        ->create();

    getJson('/api/v2/pop/categories')
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonStructure(['data' => [['id', 'name', 'image_url']]]);
});

it('returns reports for series', function () {
    CardCategory::factory()->count(2)
        ->state(new Sequence(
            ['id' => 1],
            ['id' => 2],
        ))
        ->create();

    CardSeries::factory()->count(3)
        ->state(new Sequence(
            ['card_category_id' => 1],
            ['card_category_id' => 1],
            ['card_category_id' => 2],
        ))
        ->create();

    PopReportsSeries::factory()->count(3)
        ->state(new Sequence(
            ['card_series_id' => 1],
            ['card_series_id' => 2],
            ['card_series_id' => 3],
        ))
        ->create();

    getJson('/api/v2/pop/categories/1')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

it('returns reports for sets', function () {
    CardCategory::factory()->create(['id' => 1]);

    CardSeries::factory()->count(2)
        ->state(new Sequence(
            ['card_category_id' => 1],
            ['card_category_id' => 1],
        ))
        ->create();

    CardSet::factory()->count(3)
        ->state(new Sequence(
            ['card_series_id' => 1],
            ['card_series_id' => 1],
            ['card_series_id' => 2],
        ))
        ->create();

    PopReportsSet::factory()->count(3)
        ->state(new Sequence(
            ['card_series_id' => 1, 'card_set_id' => 1],
            ['card_series_id' => 1, 'card_set_id' => 2],
            ['card_series_id' => 2, 'card_set_id' => 3],
        ))
        ->create();

    getJson('/api/v2/pop/categories/1/series/1')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

it('returns reports for cards', function () {
    CardCategory::factory()->create(['id' => 1]);

    CardSeries::factory()->count(1)
        ->create(['card_category_id' => 1]);

    CardSet::factory()->count(2)
        ->state(new Sequence(
            ['card_series_id' => 1],
            ['card_series_id' => 1],
        ))
        ->create();

    CardProduct::factory()->count(3)
        ->state(new Sequence(
            ['card_category_id' => 1, 'card_set_id' => 1],
            ['card_category_id' => 1, 'card_set_id' => 1],
            ['card_category_id' => 1, 'card_set_id' => 2],
        ))
        ->create();

    PopReportsCard::factory()->count(3)
        ->state(new Sequence(
            ['card_set_id' => 1, 'card_product_id' => 1],
            ['card_set_id' => 1, 'card_product_id' => 2],
            ['card_set_id' => 2, 'card_product_id' => 3],
        ))
        ->create();

    getJson('/api/v2/pop/categories/1/series/1/sets/1')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});
