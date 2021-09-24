<?php

namespace Database\Factories;

use App\Models\UserCard;
use App\Models\UserCardCertificate;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserCardCertificateFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = UserCardCertificate::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_card_id' => UserCard::factory(),
            'number' => random_int(20000, 50000),
        ];
    }
}