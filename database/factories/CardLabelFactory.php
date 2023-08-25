<?php

namespace Database\Factories;

use App\Models\CardProduct;
use Illuminate\Database\Eloquent\Factories\Factory;

class CardLabelFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'card_product_id' => CardProduct::factory(),
            'line_one' => $this->faker->words(3, true),
            'line_two' => $this->faker->word(),
            'line_three' => $this->faker->words(2, true),
            'line_four' => '#'.$this->faker->randomNumber(3),
        ];
    }
}
