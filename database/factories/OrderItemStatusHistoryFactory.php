<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderItemStatusHistory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemStatusHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'order_item_status_id' => OrderItemStatus::factory(),
            'order_item_id' => OrderItem::factory(),
            'notes' => $this->faker->sentence(),
            'user_id' => User::factory(),
        ];
    }
}
