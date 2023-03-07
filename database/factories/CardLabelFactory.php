<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CardProduct;

class CardLabelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'card_product_id' => CardProduct::factory(),
            'line_one' => $this->faker->words(3, true),
            'line_two' => $this->faker->word(),
            'line_three' => $this->faker->words(2, true),
            'line_four' => '#'.  $this->faker->randomNumber(3),
        ];
    }
}
