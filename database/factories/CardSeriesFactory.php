<?php

namespace Database\Factories;

use App\Models\CardCategory;
use App\Models\CardSeries;
use Illuminate\Database\Eloquent\Factories\Factory;

class CardSeriesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName(),
            'image_path' => $this->faker->url(),
            'image_bucket_path' => $this->faker->url(),
            'card_category_id' => CardCategory::factory(),
        ];
    }
}
