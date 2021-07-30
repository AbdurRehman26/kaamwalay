<?php

namespace Database\Seeders;

use App\Models\CardProduct;
use Illuminate\Database\Seeder;

class CardProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        CardProduct::factory()->count(5)->create();
    }
}
