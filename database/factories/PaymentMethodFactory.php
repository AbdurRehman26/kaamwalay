<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentMethodFactory extends Factory
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

    public function wallet(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Wallet',
                'code' => 'wallet',
            ];
        });
    }
}
