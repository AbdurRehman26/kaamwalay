<?php

namespace Database\Seeders;

use App\Models\AutographType;
use Illuminate\Database\Seeder;

class AutographTypeSeeder extends Seeder
{
    public function run(): void
    {
        AutographType::factory()
            ->count(2)
            ->create();
    }
}
