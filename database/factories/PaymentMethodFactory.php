<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\PaymentMethod;

class PaymentMethodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
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
