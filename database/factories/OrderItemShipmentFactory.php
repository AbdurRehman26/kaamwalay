<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\OrderItemShipment;
use App\Models\ShippingMethod;

class OrderItemShipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'shipment_date' => $this->faker->dateTime(),
            'tracking_number' => $this->faker->uuid(),
            'tracking_url' => $this->faker->url(),
            'shipping_provider' => $this->faker->word(),
            'shipping_method_id' => ShippingMethod::inRandomOrder()->first()->id,
        ];
    }
}
