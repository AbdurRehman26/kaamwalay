<?php

namespace Database\Seeders;

use App\Models\CustomerAddress;
use Illuminate\Database\Seeder;

class CustomerAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CustomerAddress::factory()
            ->count(5)
            ->create();
    }
}
