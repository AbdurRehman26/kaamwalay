<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AddPlatformAdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::factory()
            ->admin()
            ->withRole(config('permission.roles.admin'))
            ->create([
                'first_name' => 'Robograding',
                'last_name' => 'Platform',
                'email' => 'platform@robograding.com',
                'username' => 'robograding.platform'
            ]);
    }
}
