<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\ShippingMethod;

class ShippingMethodFactory extends Factory
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
