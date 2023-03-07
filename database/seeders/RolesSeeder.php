<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        foreach (config('permission.roles') as $role) {
            Role::updateOrCreate([
                'name' => $role,
                'guard_name' => 'api'
            ]);
        }
    }
}
