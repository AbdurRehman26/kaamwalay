<?php

namespace Database\Factories;

use App\Models\Country;
use App\Models\CustomerAddress;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerAddressFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CustomerAddress::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory()->withRole(config('permission.roles.customer')),
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'address' => $this->faker->address,
            'city' => $this->faker->city,
            'state' => $this->faker->stateAbbr(),
            'zip' => $this->faker->postcode,
            'phone' => $this->faker->phoneNumber,
            'flat' => $this->faker->numberBetween(1, 10),
            'country_id' => Country::factory(),
        ];
    }
}
