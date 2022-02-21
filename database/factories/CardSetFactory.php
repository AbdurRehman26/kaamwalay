<?php

namespace Database\Factories;

use App\Models\CardCategory;
use App\Models\CardSeries;
use App\Models\CardSet;
use Illuminate\Database\Eloquent\Factories\Factory;

class CardSetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->firstName(),
            'card_series_id' => CardSeries::factory(),
            'card_category_id' => CardCategory::factory(),
            'description' => $this->faker->sentence(),
            'cards_number' => $this->faker->randomNumber(3),
            'secret_cards' => $this->faker->randomNumber(3),
            'release_date_formatted' => $this->faker->date('M jS Y'),
            'image_path' => $this->faker->url(),
            'image_bucket_path' => $this->faker->url(),
            'set_url' => $this->faker->url(),
            'release_date' => $this->faker->date(),
            'release_year' => $this->faker->year(),
        ];
    }
}
