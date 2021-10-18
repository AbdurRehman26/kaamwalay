<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NewImportedCardProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('card_products')->insert([
            [
                'card_number' => '124/236',
                'card_number_order' => 124,
                'card_url' => 'https://www.pokellector.com/card/Zygarde-Unified-Minds-UMI-124',
                'card_category_id' => 1,
                'image_path' => 'https://crystal-cdn2.crystalcommerce.com/photos/6520232/medium/pku_smum_124rev.jpg',
                'name' => 'Zygarde',
                'rarity' => 'Rare',
                'card_set_id' => 124,
                'created_at' => '2021-10-12 19:16:15',
                'updated_at' => '2021-10-12 19:16:15',
                'variant_name' => 'Reverse Holo',
                'variant_category' => 'Surface',
                'holo_type' => 'REV.HOLO',
            ],
            [
                'card_number' => '19/132',
                'card_number_order' => 19,
                'card_url' => 'https://www.pokellector.com/card/The-Rockets-Trap-Gym-Heroes-G1-19',
                'card_category_id' => 1,
                'image_path' => 'https://content.tcgcollector.com/content/images/00/8c/86/008c867463d8a9fa40e3a50435aa9a765c5e2c12026eac424cfb9bfa256d2502.jpg',
                'name' => 'The Rocket\'s Trap',
                'rarity' => 'Rare',
                'card_set_id' => 124,
                'created_at' => '2021-10-12 19:16:15',
                'updated_at' => '2021-10-12 19:16:15',
                'variant_name' => '1st Edition',
                'variant_category' => 'Edition',
                'holo_type' => 'HOLO',
            ],
            [
                'card_number' => '104/132',
                'card_number_order' => 104,
                'card_url' => 'https://www.pokellector.com/card/Rockets-Training-Gym-Gym-Heroes-G1-104',
                'card_category_id' => 1,
                'image_path' => 'https://content.tcgcollector.com/content/images/bd/35/9b/bd359b5a7ae62a34aaa4b28286fcac2d5f722cf4570aeaab584fff05bb689e2d.jpg',
                'name' => 'Rocket\'s Training Gym',
                'rarity' => 'Rare',
                'card_set_id' => 124,
                'created_at' => '2021-10-12 19:16:15',
                'updated_at' => '2021-10-12 19:16:15',
                'variant_name' => '1st Edition',
                'variant_category' => 'Edition',
                'holo_type' => '',
            ],
            [
                'card_number' => '16/102',
                'card_number_order' => 16,
                'card_url' => 'https://www.pokellector.com/card/Zapdos-Base-Set-BS-16',
                'card_category_id' => 1,
                'image_path' => 'https://crystal-cdn3.crystalcommerce.com/photos/1202993/medium/Zapdos_-_16_102.jpg',
                'name' => 'Zapdos',
                'rarity' => 'Rare',
                'card_set_id' => 130,
                'created_at' => '2021-10-12 19:16:15',
                'updated_at' => '2021-10-12 19:16:15',
                'variant_name' => 'Shadowless',
                'variant_category' => 'Edition',
                'holo_type' => 'HOLO',
            ],
            [
                'card_number' => '69/102',
                'card_number_order' => 69,
                'card_url' => 'https://www.pokellector.com/card/Weedle-Base-Set-BS-69',
                'card_category_id' => 1,
                'image_path' => 'https://crystal-cdn2.crystalcommerce.com/photos/1202983/medium/Weedle_-_69_102.jpg',
                'name' => 'Weedle',
                'rarity' => 'Common',
                'card_set_id' => 130,
                'created_at' => '2021-10-12 19:16:15',
                'updated_at' => '2021-10-12 19:16:15',
                'variant_name' => 'Shadowless',
                'variant_category' => 'Edition',
                'holo_type' => '',
            ],
        ]);
    }
}
