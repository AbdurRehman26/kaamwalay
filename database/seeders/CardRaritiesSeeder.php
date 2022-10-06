<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CardRaritiesSeeder extends Seeder
{
    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        \DB::table('card_rarities')->insert([
            [
                'card_category_id' => 1,
                'created_at' => '2021-08-07 19:10:36',
                'name' => 'R1',
                'updated_at' => '2021-08-07 19:10:36',
            ],
            [
                'card_category_id' => 1,
                'created_at' => '2021-08-07 19:10:36',
                'name' => 'R2',
                'updated_at' => '2021-08-07 19:10:36',
            ],
            [
                'card_category_id' => 1,
                'created_at' => '2021-08-07 19:10:36',
                'name' => 'R3',
                'updated_at' => '2021-08-07 19:10:36',
            ],
            [
                'card_category_id' => 1,
                'created_at' => '2021-08-07 19:10:36',
                'name' => 'R4',
                'updated_at' => '2021-08-07 19:10:36',
            ],
            [
                'card_category_id' => 1,
                'created_at' => '2021-08-07 19:10:36',
                'name' => 'R5',
                'updated_at' => '2021-08-07 19:10:36',
            ],
        ]);

    }
}
