<?php

use App\Models\CardSeries;
use App\Models\CardSet;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
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
    $response = $this->service->getSeriesReport($this->userCard->orderItem->cardProduct->cardSet->cardSeries->cardCategory);
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

test('card product population gets updated same as pop report', function () {

    $order = Order::factory()->create([
        'order_status_id' => OrderStatus::GRADED,
    ]);

    $orderItem = OrderItem::factory()->create([
        'order_id' => $order->id,
        'order_item_status_id' => OrderItemStatus::GRADED,
    ]);

    $userCard = UserCard::factory()->create([
        'order_item_id' => $orderItem->id,
        'overall_grade' => 10.0,
    ]);

    $card = $userCard->orderItem->cardProduct;
    $this->service->updateCardProductsReport($card);

    expect($orderItem->cardProduct->population)->toBe($orderItem->cardProduct->popReportsCard->population);
    expect($orderItem->cardProduct->population)->toBe(1);
});
