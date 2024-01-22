<?php

namespace Database\Seeders;

use App\Models\AutographProduct;
use Illuminate\Database\Seeder;

class AutographProductSeeder extends Seeder
{
    public function run(): void
    {
        AutographProduct::factory()
            ->count(100)
            ->create();
    }
}
