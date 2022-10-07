<?php

namespace Database\Factories;

use App\Models\CardCategoryType;
use Illuminate\Database\Eloquent\Factories\Factory;

class CardCategoryFactory extends Factory
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
            'image_url' => $this->faker->url(),
            'is_enabled' => $this->faker->boolean(),
            'card_category_type_id' => CardCategoryType::factory(),
        ];
    }
}
