<?php

namespace Database\Factories;

use App\Models\CardCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class CardRarityFactory extends Factory
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
            'card_category_id' => CardCategory::factory(),
        ];
    }
}
