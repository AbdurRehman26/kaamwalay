<?php

use App\Models\CardSeries;
use App\Models\CardSet;
use App\Models\UserCard;
use App\Services\PopReport\PopReportService;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;

beforeEach(function () {
    $this->seed([
        CardCategoriesSeeder::class,
        CardSeriesSeeder::class,
        CardSetsSeeder::class,
        CardProductSeeder::class,
    ]);

    $this->userCard = UserCard::factory()->state(new Sequence(
        ['overall_grade' => 10.0]
    ))->create();

    $this->service = new PopReportService();
});

test('get series report list', function () {
    $cardSeriesId = $this->userCard->orderItem->cardProduct->cardSet->card_series_id;
    $this->service->updateSeriesReport(CardSeries::find($cardSeriesId));
    $response = $this->service->getSeriesReport();
    expect(1)->toBe(count($response->items()));
});

test('get sets report list', function () {
    $cardSet = $this->userCard->orderItem->cardProduct->cardSet;
    $this->service->updateSetsReport(CardSet::find($cardSet->id));
    $response = $this->service->getSetsReport(CardSeries::find($cardSet->card_series_id));
    expect(1)->toBe(count($response->items()));
});

test('get cards report list', function () {
    $card = $this->userCard->orderItem->cardProduct;
    $this->service->updateCardProductsReport($card);
    $response = $this->service->getCardsReport($card->cardSet);
    expect(1)->toBe(count($response->items()));
});
