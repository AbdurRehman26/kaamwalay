<?php

namespace Database\Factories;

use App\Models\OrderShipment;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ShippingMethod;

class OrderShipmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = OrderShipment::class;

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
            'tracking_url' => $this->faker->url(),
            'shipping_provider' => $this->faker->word(),
            'shipping_method_id' => ShippingMethod::inRandomOrder()->first()->id,
        ];
    }
}
