<?php

namespace Database\Factories;

use App\Models\CardSeries;
use App\Models\CardSet;
use Illuminate\Database\Eloquent\Factories\Factory;

class PopReportsSetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $set = CardSet::factory()->create();

        return [
            'card_series_id' => $set->card_series_id,
            'card_set_id' => $set->id,
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
