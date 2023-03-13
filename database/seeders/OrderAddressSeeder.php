<?php

namespace Database\Seeders;

use App\Models\OrderAddress;
use Illuminate\Database\Seeder;

class OrderAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OrderAddress::factory()
            ->count(5)
            ->create();
    }
}
