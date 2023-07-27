<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemCustomerShipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'shipment_date' => $this->faker->dateTime(),
            'tracking_number' => $this->faker->uuid(),
            'shipping_provider' => $this->faker->word(),
        ];
    }
}
