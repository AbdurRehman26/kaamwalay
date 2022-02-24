<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
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
        if ($pokemonCategory?->exists()) {
            DB::table('card_surfaces')->insert([
                ['name' => 'Holo', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Cracked Ice Holo', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Cosmos Holo', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Reverse Holo', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Reverse Foil', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Tinsel Holo', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Mirror Holo', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Speckle Holo', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Sparkle Holo', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Crosshatch Holo', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Sheen Holo', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Cracked Ice Reverse Holo', 'card_category_id' => $pokemonCategory->id],
                ['name' => 'Water Web Holo', 'card_category_id' => $pokemonCategory->id],
            ]);
        }

        //MetaZoo
        $metazooCategory = DB::table('card_categories')->where('name', 'MetaZoo')->first();
        if ($metazooCategory?->exists()) {
            DB::table('card_surfaces')->insert([
                ['name' => 'Holo', 'card_category_id' => $metazooCategory->id],
                ['name' => 'Reverse Holo', 'card_category_id' => $metazooCategory->id],
            ]);
        }

        //Dragon Ball Super
        $dragonBallSuperCategory = DB::table('card_categories')->where('name', 'Dragon Ball Super')->first();
        if ($dragonBallSuperCategory?->exists()) {
            DB::table('card_surfaces')->insert([
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
        if ($yugiohCategory?->exists()) {
            DB::table('card_surfaces')->insert(
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

        //Basketball
        $basketballCategory = DB::table('card_categories')->where('name', 'Basketball')->first();
        if ($basketballCategory?->exists()) {
            DB::table('card_surfaces')->insert([
                ['name' => 'BASE', 'card_category_id' => $basketballCategory->id],
                ['name' => 'BLACK GOLD PRIZM', 'card_category_id' => $basketballCategory->id],
                ['name' => 'BLACK PRIZM', 'card_category_id' => $basketballCategory->id],
                ['name' => 'BLACK SHIMMER 1/1', 'card_category_id' => $basketballCategory->id],
                ['name' => 'BLUE ICE', 'card_category_id' => $basketballCategory->id],
                ['name' => 'BLUE PRIZM', 'card_category_id' => $basketballCategory->id],
                ['name' => 'BLUE SHIMMER', 'card_category_id' => $basketballCategory->id],
                ['name' => 'BLUE WAVE PRIZM', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Dominance', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Dominance Prizms Green', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Dominance Prizms Silver', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Downtown Bound', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Downtown Bound Fast Break', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Downtown Bound Prizms Black', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Downtown Bound Prizms Gold', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Downtown Bound Prizms Hyper', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Downtown Bound Prizms Mojo', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Downtown Bound Prizms Silver', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Emergent', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Emergent Prizms Green', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Emergent Prizms Silver', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fast Break Autographs', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fast Break Autographs Black', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fast Break Autographs Gold', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fast Break Rookie Autographs', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fast Break Rookie Autographs Black', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fast Break Rookie Autographs Gold', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fearless', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fearless Fast Break', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fearless Prizms Black', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fearless Prizms Gold', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fearless Prizms Hyper', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fearless Prizms Mojo', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fearless Prizms Silver', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fireworks', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fireworks Fast Break', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fireworks Prizms Black', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fireworks Prizms Gold', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fireworks Prizms Hyper', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fireworks Prizms Mojo', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Fireworks Prizms Silver', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Instant Impact', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Instant Impact Prizms Green', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Instant Impact Prizms Silver', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Penmanship', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Penmanship Prizms Green Ice', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Penmanship Prizms Orange Ice', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Penmanship Prizms Silver', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Prizm Flashback', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Prizm Flashback Fast Break', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Prizm Flashback Prizms Black', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Prizm Flashback Prizms Gold', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Prizm Flashback Prizms Hyper', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Prizm Flashback Prizms Mojo', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Prizm Flashback Prizms Silver', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Rookie Penmanship', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Rookie Penmanship Prizms Blue Wave', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Rookie Penmanship Prizms Gold Wave', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Rookie Penmanship Prizms Green Ice', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Rookie Penmanship Prizms Orange Ice', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Rookie Penmanship Prizms Silver', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Rookie Signatures', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Rookie Signatures Prizms Black', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Rookie Signatures Prizms Choice', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Rookie Signatures Prizms Choice Green', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Rookie Signatures Prizms Gold', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Rookie Signatures Prizms Mojo', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Rookie Signatures Prizms Silver', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Rookie Signatures Prizms White Sparkle', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Sensational Signatures', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Sensational Signatures Prizms Black', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Sensational Signatures Prizms Choice', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Sensational Signatures Prizms Choice Green', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Sensational Signatures Prizms Gold', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Sensational Signatures Prizms Mojo', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Sensational Signatures Prizms Silver', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Sensational Swatches', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Sensational Swatches Prime', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Sensational Swatches Prizms Green Ice', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Sensational Swatches Prizms Orange Ice', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Signatures', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Signatures Prizms Black', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Signatures Prizms Choice', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Signatures Prizms Choice Green', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Signatures Prizms Gold', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Signatures Prizms Mojo', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Signatures Prizms Silver', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Sophomore Stars', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Sophomore Stars Prizms Green', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Sophomore Stars Prizms Silver', 'card_category_id' => $basketballCategory->id],
                ['name' => 'USA Basketball', 'card_category_id' => $basketballCategory->id],
                ['name' => 'USA Basketball Prizms Green', 'card_category_id' => $basketballCategory->id],
                ['name' => 'USA Basketball Prizms Silver', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Widescreen', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Widescreen Fast Break', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Widescreen Prizms Black', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Widescreen Prizms Gold', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Widescreen Prizms Hyper', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Widescreen Prizms Mojo', 'card_category_id' => $basketballCategory->id],
                ['name' => 'Widescreen Prizms Silver', 'card_category_id' => $basketballCategory->id],
            ]);
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
};
