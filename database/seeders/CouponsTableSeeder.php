<?php

namespace Database\Seeders;

use App\Models\Couponable;
use Illuminate\Database\Seeder;

class CouponsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        Couponable::factory()
            ->count(10)
            ->create();
    }
}
