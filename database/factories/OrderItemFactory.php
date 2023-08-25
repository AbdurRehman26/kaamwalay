<?php

namespace Database\Factories;

use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderItemCustomerShipment;
use App\Models\OrderItemShipment;
use App\Models\OrderItemStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'card_product_id' => CardProduct::factory(),
            'order_item_shipment_id' => OrderItemShipment::factory(),
            'order_item_customer_shipment_id' => OrderItemCustomerShipment::factory(),
            'order_item_status_id' => OrderItemStatus::factory(),
            'quantity' => $this->faker->numberBetween(1, 50),
            'name' => $this->faker->name(),
            'description' => $this->faker->text(),
            'declared_value_per_unit' => $this->faker->randomFloat(2, 1, 99999999.99),
            'declared_value_total' => $this->faker->randomFloat(2, 1, 99999999.99),
        ];
    }
}
