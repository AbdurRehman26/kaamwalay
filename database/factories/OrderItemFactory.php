<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemShipment;
use App\Models\OrderItemCustomerShipment;

class OrderItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = OrderItem::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'order_id' => Order::inRandomOrder()->first()->id,
            'card_product_id' => CardProduct::inRandomOrder()->first()->id,
            'order_item_shipment_id' => OrderItemShipment::factory(),
            'order_item_customer_shipment_id' => OrderItemCustomerShipment::factory(),
            'quantity' => $this->faker->numberBetween(1, 50),
            'name' => $this->faker->name,
            'description' => $this->faker->text,
            'declared_value_per_unit' => $this->faker->randomFloat(2, 1, 99999999.99),
            'declared_value_total' => $this->faker->randomFloat(2, 1, 99999999.99),
        ];
    }
}
