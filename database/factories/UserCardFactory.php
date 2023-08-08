<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserCardFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'order_item_id' => OrderItem::factory(),
            'user_id' => User::factory(),
        ];
    }
}
