<?php

namespace Database\Seeders;

use App\Models\AutographCategory;
use Illuminate\Database\Seeder;

class AutographCategorySeeder extends Seeder
{
    public function run(): void
    {
        AutographCategory::factory()
            ->count(2)
            ->create();
    }
}
