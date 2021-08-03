<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Country;
use App\Models\CustomerAddress;
use App\Models\User;
use App\Models\Role;

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
            'user_id' => User::factory()->withRole(Role::CUSTOMER_ROLE_ID),
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'address' => $this->faker->address,
            'city' => $this->faker->city,
            'state' => $this->faker->word,
            'zip' => $this->faker->postcode,
            'phone' => $this->faker->phoneNumber,
            'flat' => $this->faker->numberBetween(1, 10),
            'is_default_shipping' => $this->faker->numberBetween(0, 1),
            'is_default_billing' => $this->faker->numberBetween(0, 1),
            'country_id' => Country::factory(),
        ];
    }
}
