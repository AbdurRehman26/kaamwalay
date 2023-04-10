<?php

namespace Database\Factories;

use App\Models\CardSeries;
use Illuminate\Database\Eloquent\Factories\Factory;

class PopReportsSeriesFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'card_series_id' => CardSeries::factory(),
            'pr' => $this->faker->numberBetween(1, 10),
            'fr' => $this->faker->numberBetween(1, 10),
            'good' => $this->faker->numberBetween(1, 10),
            'good_plus' => $this->faker->numberBetween(1, 10),
            'vg' => $this->faker->numberBetween(1, 10),
            'vg_plus' => $this->faker->numberBetween(1, 10),
            'vg_ex' => $this->faker->numberBetween(1, 10),
            'vg_ex_plus' => $this->faker->numberBetween(1, 10),
            'ex' => $this->faker->numberBetween(1, 10),
            'ex_plus' => $this->faker->numberBetween(1, 10),
            'ex_mt' => $this->faker->numberBetween(1, 10),
            'ex_mt_plus' => $this->faker->numberBetween(1, 10),
            'nm' => $this->faker->numberBetween(1, 10),
            'nm_plus' => $this->faker->numberBetween(1, 10),
            'nm_mt' => $this->faker->numberBetween(1, 10),
            'nm_mt_plus' => $this->faker->numberBetween(1, 10),
            'mint' => $this->faker->numberBetween(1, 10),
            'mint_plus' => $this->faker->numberBetween(1, 10),
            'gem_mt' => $this->faker->numberBetween(1, 10),
            'total' => $this->faker->numberBetween(1, 10),
            'total_plus' => $this->faker->numberBetween(1, 10),
        ];
    }
}
