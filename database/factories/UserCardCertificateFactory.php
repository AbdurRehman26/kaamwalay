<?php

namespace Database\Factories;

use App\Models\UserCard;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserCardCertificateFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'user_card_id' => UserCard::factory(),
            'number' => random_int(20000, 50000),
        ];
    }
}
