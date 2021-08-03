<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = [Role::ADMIN_NAME, Role::CUSTOMER_NAME];

        foreach ($roles as $role) {
            Role::factory([
                'name' => $role,
            ])->create();
        }
    }
}
