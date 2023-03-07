<?php

namespace Database\Factories;

use App\Models\CardCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class CardSurfaceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName(),
            'card_category_id' => CardCategory::factory(),
        ];
    }
}
