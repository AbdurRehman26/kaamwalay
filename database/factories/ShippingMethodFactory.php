<?php

namespace Database\Factories;

use App\Models\ShippingMethod;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShippingMethodFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName(),
            'code' => $this->faker->word(),
        ];
    }

    public function insured()
    {
        return $this->state(function (array $attributes) {
            return [
                'code' => ShippingMethod::INSURED_SHIPPING,
            ];
        });
    }

    public function vault()
    {
        return $this->state(function (array $attributes) {
            return [
                'code' => ShippingMethod::VAULT_STORAGE,
            ];
        });
    }
}
