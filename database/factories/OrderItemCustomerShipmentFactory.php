<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\OrderItemCustomerShipment;

class OrderItemCustomerShipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'shipment_date' => $this->faker->dateTime(),
            'tracking_number' => $this->faker->uuid(),
            'shipping_provider' => $this->faker->word(),
        ];
    }
}
