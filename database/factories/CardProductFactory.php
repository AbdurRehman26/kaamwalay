<?php

namespace Database\Factories;

use App\Models\CardCategory;
use App\Models\CardSet;
use Illuminate\Database\Eloquent\Factories\Factory;

class CardProductFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName(),
            'edition' => '1st Edition',
            'surface' => 'Reverse Holo',
            'variant' => 'Next Destinies Stage 1 Blisters',
            'card_set_id' => CardSet::factory(),
            'card_category_id' => CardCategory::factory(),
            'rarity' => 'Common',
            'card_number' => $this->faker->randomNumber(3),
            'image_path' => 'https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png',
            'card_url' => 'https://www.pokellector.com/card/Bellsprout-Battle-Styles-SWSH05-1',
            'image_bucket_path' => 's3://wooter-ags-database-cards/pokemon_cards_images/cards_images/Bellsprout.SWSH05.1.37528.png',
            'card_number_order' => $this->faker->randomNumber(3),
            'description' => $this->faker->word(),
        ];
    }
}
