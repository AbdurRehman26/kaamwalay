<?php

use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
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

    $this->userCard = UserCard::factory()->state(new Sequence(
        ['overall_grade' => 10.0]
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
<<<<<<< HEAD
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
=======
>>>>>>> 013486fd1a75f91b21a7cea44bdb783a8a49036e
});
