<?php

namespace Database\Factories;

use App\Models\Model;
use App\Models\Role;
use App\Models\RoleUser;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoleUserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = RoleUser::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'role_id' => Role::CUSTOMER_ROLE_ID,
        ];
    }

    /**
     * Define the model's admin state.
     *
     * @return $this
     */
    public function admin()
    {
        return $this->state([
            'role_id' => Role::ADMIN_ROLE_ID,
        ]);
    }
}
