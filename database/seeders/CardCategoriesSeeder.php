<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CardCategoriesSeeder extends Seeder
{
    /**
     * Auto generated seed file
     */
    public function run(): void
    {

        \DB::table('card_categories')->insert([
            [
                'created_at' => '2021-08-07 21:10:18',
                'id' => 1,
                'name' => 'Pokemon',
                'updated_at' => '2021-08-07 21:10:18',
            ],
        ]);

    }
}
