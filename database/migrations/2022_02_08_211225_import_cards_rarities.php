<?php

use Illuminate\Database\Migrations\Migration;

class ImportCardsRarities extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        //Pokemon
        $pokemonCategory = DB::table('card_categories')->where('name', 'Pokemon')->first();
        if ($pokemonCategory) {
            DB::table('card_rarities')->insert([
                ['name' => 'Uncommon', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Rare Holo', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Common', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Rare', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Rare Holo ex', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Rare Holo ☆', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Rare Holo LV.X', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'LEGEND', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'C', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'R', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'U', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'UR', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'SR', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'RR', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'HR', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'TR', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'PR', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'RRR', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'S', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'SSR', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Amazing Rare', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Rare Shining', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Secret Rare', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Super Secret Rare', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Ultra Rare', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Prism Star', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Promo', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Rare Holo V', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Rare Ultra', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Rare Holo VMAX', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Rare Rainbow', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Rare Secret', 'card_category_id' => $pokemonCategory->id],
            ]);
        }

        //MetaZoo
        $metazooCategory = DB::table('card_categories')->where('name', 'MetaZoo')->first();
        if ($metazooCategory) {
            DB::table('card_rarities')->insert([
                ['name' => 'Promo', 'card_category_id' => $metazooCategory->id],
                ['name' => 'Secret Rare', 'card_category_id' => $metazooCategory->id],
                ['name' => 'Holiday', 'card_category_id' => $metazooCategory->id],
                ['name' => 'Bronze', 'card_category_id' => $metazooCategory->id],
                ['name' => 'Gold', 'card_category_id' => $metazooCategory->id],
                ['name' => 'Silver', 'card_category_id' => $metazooCategory->id],
                ['name' => 'Cryptid', 'card_category_id' => $metazooCategory->id],
                ['name' => 'Reverse', 'card_category_id' => $metazooCategory->id],
            ]);
        }

        //Dragon Ball Super
        $dragonBallSuperCategory = DB::table('card_categories')->where('name', 'Dragon Ball Super')->first();
        if ($dragonBallSuperCategory) {
            DB::table('card_rarities')->insert([
                ['name' => 'Uncommon', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Foil', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Super Rare', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Tournament Promo', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Special Rare', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Secret Rare', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Common', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Rare', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Secret Rare Non Foil Reprint', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Ignoble Villain Rare', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Noble Hero Rare', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Reboot Leader Rare', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Iconic Attack Rare', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Destruction Rare', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Special Rare Signature', 'card_category_id' => $dragonBallSuperCategory->id],
                ['name' => 'Infinite Saiyan Rare', 'card_category_id' => $dragonBallSuperCategory->id],
            ]);
        }

        //YU-GI-OH!
        $yugiohCategory = DB::table('card_categories')->where('name', 'YU-GI-OH!')->first();
        if ($yugiohCategory) {
            DB::table('card_rarities')->insert(
                [
                    ['name' => 'Common', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Super Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Ultra Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Secret Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Ultimate Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Ghost Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Prismatic Secret Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Starlight Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Gold Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Platinum Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Parallel Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Super Parallel Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Ultra Parallel Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Secret Parallel Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Duel Terminal', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Starfoil Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Mosaic Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Shatterfoil Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Gold Secret Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Platinum Secret Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Pharaoh Ultra Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Pharaoh Secret Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Collector\'s Rare', 'card_category_id' => $yugiohCategory->id],
                    ['name' => 'Premium Gold Rare', 'card_category_id' => $yugiohCategory->id],
                ]
            );
        }

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
