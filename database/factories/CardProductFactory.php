<?php

namespace Database\Factories;

use App\Models\CardCategory;
use App\Models\CardSet;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CardProduct;

class CardProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CardProduct::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->firstName(),
            "variant_name" => '1st Edition',
            "variant_category" => 'Surface',
            "holo_type" => 'REV.HOLO',
            'card_set_id' => CardSet::factory(),
            'card_category_id' => CardCategory::factory(),
            'rarity' => 'Common',
            'card_number' => $this->faker->randomNumber(3),
            'image_path' => 'https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png',
            'card_url' => 'https://www.pokellector.com/card/Bellsprout-Battle-Styles-SWSH05-1',
            'image_bucket_path' => 's3://wooter-ags-database-cards/pokemon_cards_images/cards_images/Bellsprout.SWSH05.1.37528.png',
            'card_number_order' => $this->faker->randomNumber(3),
        ];
    }
}
