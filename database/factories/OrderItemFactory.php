<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemShipment;

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
            'order_id' => Order::factory(),
            'card_product_id' => CardProduct::factory(),
            'order_item_shipment_id' => OrderItemShipment::factory(),
            'quantity' => $this->faker->numberBetween(1, 10000),
            'unit_price' => $this->faker->randomFloat(2, 10, 99999999.99),
            'total_price' => $this->faker->randomFloat(2, 10, 99999999.99),
            'name' => $this->faker->name,
            'description' => $this->faker->text,
            'declared_value' => $this->faker->randomFloat(2, 1, 99999999.99),
        ];
    }
}