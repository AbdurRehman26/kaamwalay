<?php

namespace Database\Factories;

use App\Models\CardCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class CardCategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CardCategory::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->firstName(),
        ];
    }
}
