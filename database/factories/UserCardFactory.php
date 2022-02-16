<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\User;
use App\Models\UserCard;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserCardFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'order_item_id' => OrderItem::factory(),
            'user_id' => User::factory(),
        ];
    }
}
