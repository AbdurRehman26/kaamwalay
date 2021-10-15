<?php

use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;

beforeEach(function () {
    $this->seed([
        CardCategoriesSeeder::class,
        CardSeriesSeeder::class,
        CardSetsSeeder::class,
        CardProductSeeder::class,
    ]);
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
