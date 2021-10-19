<?php

use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Models\UserCard;
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

    $order = Order::factory()->create([
        'order_status_id' => OrderStatus::GRADED,
    ]);

    $orderItem = OrderItem::factory()->create([
        'order_id' => $order->id,
        'order_item_status_id' => OrderItemStatus::GRADED,
    ]);

    $this->userCard = UserCard::factory()->state(new Sequence(
        [
            'overall_grade' => 10.0,
            'order_item_id' => $orderItem->id,
        ]
    ))->create();

    $this->cardProduct = $this->userCard->orderItem->cardProduct;
});

it('initializes POP Reports For Series, Sets and Cards.', function () {
    $this->artisan('pop-reports:initialize')
        ->expectsQuestion('Initialize Report Values for :', "All")
        ->expectsOutput('Initializing Values for Series')
        ->expectsOutput('Initializing Values for Series Completed')
        ->expectsOutput('Initializing Values for Sets')
        ->expectsOutput('Initializing Values for Sets Completed')
        ->expectsOutput('Initializing Values for Cards')
        ->expectsOutput('Initializing Values for Cards Completed')
        ->assertExitCode(0);

    $this->assertDatabaseCount('pop_reports_series', CardSeries::count());
    $this->assertDatabaseCount('pop_reports_sets', CardSet::count());
    $this->assertDatabaseCount('pop_reports_cards', CardProduct::count());
});

it('Updates series reports values', function () {
    $this->artisan('pop-reports:update-series-report')
        ->assertExitCode(0);

    $this->assertDatabaseHas('pop_reports_series', [
        'gem_mt' => 1,
        'card_series_id' => $this->cardProduct->cardSet->card_series_id,
    ]);
});

it('Updates sets reports values', function () {
    $this->artisan('pop-reports:update-sets-report')
        ->assertExitCode(0);

    $this->assertDatabaseHas('pop_reports_sets', [
        'gem_mt' => 1,
        'card_series_id' => $this->cardProduct->cardSet->card_series_id,
        'card_set_id' => $this->cardProduct->cardSet->id,
    ]);
});

it('Updates cards reports values', function () {
    $this->artisan('pop-reports:update-cards-report')
        ->assertExitCode(0);

    $this->assertDatabaseHas('pop_reports_cards', [
        'gem_mt' => 1,
        'card_product_id' => $this->cardProduct->id,
        'card_set_id' => $this->cardProduct->cardSet->id,
    ]);
});
